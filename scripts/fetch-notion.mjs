// 빌드 시 1회 실행: 노션 DB에서 제목/태그/기간 + 커버 이미지를 가져와
// data/notion-data.js (오버라이드 데이터)와 images/uiux/<slug>/cover.jpg를 생성한다.
// 환경변수(NOTION_TOKEN, NOTION_DATABASE_ID)가 없으면 조용히 스킵하고
// 기존 정적 데이터(script.js의 PROJECTS)로 빌드가 계속되게 한다.

import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const NOTION_TOKEN = process.env.NOTION_TOKEN;
const DATABASE_ID = process.env.NOTION_DATABASE_ID;
const NOTION_VERSION = '2022-06-28';
const ROOT = path.resolve(import.meta.dirname, '..');

// 노션 페이지 제목 → 사이트에서 쓰는 slug(id). 새 프로젝트를 노션에 추가하면
// 이 맵에도 한 줄 추가해야 자동 동기화된다 (없으면 건너뛰고 경고만 출력).
const TITLE_TO_SLUG = {
  '500만명의 학생을 위한 500만개의 AI 교과서, 러니파이': 'learnify',
  '약 700명 동아리 회원들의 연결을 목표로 앱 리텐션 증가': 'retention',
  '과외관리의 표준, 튜티스 Tutice': 'tutice',
  '기업 교육 플랫폼 & 관리자 페이지': 'edu-platform',
  '모임 서비스 신청&개설 Flow UX 개선': 'meetup-flow',
  '팀워크를 위한 익명 칭찬 투표 앱, Team Up': 'teamup',
  '시즈널 바이럴 서비스, 럭키슬롯': 'luckyslot',
};

function fmtDate(iso) {
  return iso ? iso.replaceAll('-', '/') : '';
}

function formatPeriod(date) {
  if (!date) return '';
  const start = fmtDate(date.start);
  const end = fmtDate(date.end);
  return end ? `${start} → ${end}` : start;
}

async function notionFetch(url, options = {}) {
  const res = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${NOTION_TOKEN}`,
      'Notion-Version': NOTION_VERSION,
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });
  if (!res.ok) {
    throw new Error(`Notion API ${res.status}: ${await res.text()}`);
  }
  return res.json();
}

async function queryAllRows() {
  const rows = [];
  let cursor;
  do {
    const body = cursor ? { start_cursor: cursor, page_size: 100 } : { page_size: 100 };
    const data = await notionFetch(`https://api.notion.com/v1/databases/${DATABASE_ID}/query`, {
      method: 'POST',
      body: JSON.stringify(body),
    });
    rows.push(...data.results);
    cursor = data.has_more ? data.next_cursor : undefined;
  } while (cursor);
  return rows;
}

async function findFirstImageUrl(pageId) {
  const data = await notionFetch(`https://api.notion.com/v1/blocks/${pageId}/children?page_size=50`);
  for (const block of data.results) {
    if (block.type === 'image') {
      return block.image.file?.url || block.image.external?.url || null;
    }
  }
  return null;
}

async function saveCover(slug, imageUrl) {
  const res = await fetch(imageUrl);
  if (!res.ok) throw new Error(`이미지 다운로드 실패: ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  const dir = path.join(ROOT, 'images', 'uiux', slug);
  await mkdir(dir, { recursive: true });
  await sharp(buf)
    .resize({ width: 2400, withoutEnlargement: true })
    .jpeg({ quality: 80 })
    .toFile(path.join(dir, 'cover.jpg'));
}

async function main() {
  if (!NOTION_TOKEN || !DATABASE_ID) {
    console.log('[notion-sync] NOTION_TOKEN / NOTION_DATABASE_ID 없음 — 동기화 스킵, 기존 데이터로 빌드 계속');
    return;
  }

  console.log('[notion-sync] 노션 DB 조회 중...');
  const rows = await queryAllRows();
  const overrides = {};

  for (const row of rows) {
    const props = row.properties;
    const title = (props['이름']?.title || []).map(t => t.plain_text).join('');
    const slug = TITLE_TO_SLUG[title];
    if (!slug) {
      console.warn(`[notion-sync] 매핑되지 않은 제목 — 건너뜀: "${title}" (TITLE_TO_SLUG에 추가 필요)`);
      continue;
    }

    const tags = (props['태그']?.multi_select || []).map(t => t.name);
    const period = formatPeriod(props['\b기간']?.date);
    overrides[slug] = { title, tags, period };

    try {
      const imageUrl = await findFirstImageUrl(row.id);
      if (imageUrl) {
        await saveCover(slug, imageUrl);
        console.log(`[notion-sync] ${slug}: 커버 이미지 갱신`);
      }
    } catch (err) {
      console.warn(`[notion-sync] ${slug}: 커버 이미지 처리 실패 — ${err.message}`);
    }
  }

  await mkdir(path.join(ROOT, 'data'), { recursive: true });
  const js = `window.NOTION_OVERRIDES = ${JSON.stringify(overrides, null, 2)};\n`;
  await writeFile(path.join(ROOT, 'data', 'notion-data.js'), js);
  console.log(`[notion-sync] 완료 — ${Object.keys(overrides).length}개 프로젝트 동기화`);
}

main().catch(err => {
  console.error('[notion-sync] 실패 (빌드는 계속 진행):', err.message);
});
