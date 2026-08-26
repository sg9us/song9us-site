// 빌드 시 1회 실행: 노션 DB에서 제목/태그/기간/카테고리/링크 + 커버 이미지를 가져와
// data/notion-data.js와 images/<category>/<slug>/cover.jpg를 생성한다.
// 환경변수(NOTION_TOKEN, NOTION_DATABASE_ID)가 없으면 조용히 스킵한다.

import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const NOTION_TOKEN = process.env.NOTION_TOKEN;
const DATABASE_ID = process.env.NOTION_DATABASE_ID;
const NOTION_VERSION = '2022-06-28';
const ROOT = path.resolve(import.meta.dirname, '..');

// 기존 이미지 폴더 보호: 제목(또는 제목 변형)→slug 고정 매핑.
// 이 목록에 있는 프로젝트는 제목이 바뀌어도 slug가 유지된다.
const LEGACY_SLUGS = {
  '500만명의 학생을 위한 500만개의 AI 교과서, 러니파이': 'learnify',
  '약 700명 동아리 회원들의 연결을 목표로 앱 리텐션 증가': 'retention',
  '약 700명 동아리 회원들의 연결을 목표로 앱 리텐션 증가, 콕 찌르기': 'retention',
  '과외관리의 표준, 튜티스 Tutice': 'tutice',
  '기업 교육 플랫폼 & 관리자 페이지': 'edu-platform',
  '모임 서비스 신청&개설 Flow UX 개선': 'meetup-flow',
  '팀워크를 위한 익명 칭찬 투표 앱, Team Up': 'teamup',
  '시즈널 바이럴 서비스, 럭키슬롯': 'luckyslot',
  '검수 과정 3단계 단축하고 반복해서 사용성 검증하기': 'content-review',
};

// 노션 제목 → 자동 slug (영문/숫자만 추출 + 페이지ID 앞 6자 접미사)
function autoSlug(title, pageId) {
  const suffix = pageId.replace(/-/g, '').slice(0, 6);
  const base = title
    .replace(/\[.*?\]/g, '')     // [대괄호 내용] 제거
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-') // 영문·숫자 아닌 문자 → 하이픈
    .replace(/^-+|-+$/g, '')     // 앞뒤 하이픈 제거
    .replace(/-{2,}/g, '-');     // 연속 하이픈 → 1개
  return base ? `${base}-${suffix}` : suffix;
}

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

async function saveCover(slug, imageUrl, category = 'uiux') {
  const res = await fetch(imageUrl);
  if (!res.ok) throw new Error(`이미지 다운로드 실패: ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  const dir = path.join(ROOT, 'images', category, slug);
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
  const slugsSeen = new Set(); // 중복 slug 방지

  for (const row of rows) {
    const props = row.properties;
    const title = (props['이름']?.title || []).map(t => t.plain_text).join('');
    if (!title) continue;

    // category select 먼저 확인 — 매핑 불가 시 스킵
    const categoryVal = props['category']?.select?.name || '';
    let category, subtype = null;
    if (categoryVal === 'UXUI')               { category = 'uiux'; }
    else if (categoryVal === 'AI Video 16:9') { category = 'aivideo'; subtype = '16:9'; }
    else if (categoryVal === 'AI Video 9:16') { category = 'aivideo'; subtype = '9:16'; }
    else if (categoryVal === 'Branding')      { category = 'branding'; }
    else {
      console.warn(`[notion-sync] "${title}": 알 수 없는 category 값 "${categoryVal}" — 스킵`);
      continue;
    }

    // slug 결정: 레거시 매핑 우선, 없으면 자동 생성
    const slug = LEGACY_SLUGS[title] || autoSlug(title, row.id);

    // 동일 slug 중복 방지 (LEGACY에서 두 제목이 같은 slug를 가리키는 경우 첫 번째 우선)
    if (slugsSeen.has(slug)) {
      console.log(`[notion-sync] "${title}": slug "${slug}" 중복 — 건너뜀`);
      continue;
    }
    slugsSeen.add(slug);

    const tags = (props['태그']?.multi_select || []).map(t => t.name);
    const period = formatPeriod(props['\b기간']?.date);
    const link = props['링크 URL']?.url || null;

    overrides[slug] = { title, tags, period, category, subtype, link };

    try {
      const imageUrl = await findFirstImageUrl(row.id);
      if (imageUrl) {
        await saveCover(slug, imageUrl, category);
        console.log(`[notion-sync] ${slug} (${category}): 커버 이미지 갱신`);
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
