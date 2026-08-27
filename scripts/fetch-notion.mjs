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

// YouTube URL → 영상 ID (11자리)
// 주의: 동일 로직이 script.js에도 있음 — 수정 시 두 파일 함께 변경
function extractYouTubeId(url) {
  if (!url) return null;
  const m = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/);
  return m ? m[1] : null;
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

// 페이지 본문의 이미지 블록 URL을 순서대로 모두 반환
async function findAllImageUrls(pageId) {
  const data = await notionFetch(`https://api.notion.com/v1/blocks/${pageId}/children?page_size=100`);
  const urls = [];
  for (const block of data.results) {
    if (block.type === 'image') {
      const url = block.image.file?.url || block.image.external?.url;
      if (url) urls.push(url);
    }
  }
  return urls;
}

// 이미지 URL 배열 저장: 첫 번째 → cover.jpg, 이후 → 02.jpg, 03.jpg ...
// 저장된 상대 경로 배열 반환
async function saveImages(slug, imageUrls, category) {
  const dir = path.join(ROOT, 'images', category, slug);
  await mkdir(dir, { recursive: true });
  const saved = [];
  for (let i = 0; i < imageUrls.length; i++) {
    const res = await fetch(imageUrls[i]);
    if (!res.ok) {
      console.warn(`  [image ${i + 1}] 다운로드 실패: ${res.status}`);
      continue;
    }
    const buf = Buffer.from(await res.arrayBuffer());
    const filename = i === 0 ? 'cover.jpg' : `${String(i + 1).padStart(2, '0')}.jpg`;
    await sharp(buf)
      .resize({ width: 2400, withoutEnlargement: true })
      .jpeg({ quality: 80 })
      .toFile(path.join(dir, filename));
    saved.push(`images/${category}/${slug}/${filename}`);
  }
  return saved;
}

// YouTube 썸네일을 cover.jpg로 저장 (maxresdefault → hqdefault 폴백)
async function saveYouTubeThumbnail(slug, videoId, category) {
  const dir = path.join(ROOT, 'images', category, slug);
  await mkdir(dir, { recursive: true });
  const coverPath = `images/${category}/${slug}/cover.jpg`;

  for (const quality of ['maxresdefault', 'hqdefault']) {
    const url = `https://img.youtube.com/vi/${videoId}/${quality}.jpg`;
    const res = await fetch(url);
    if (!res.ok) continue;
    const buf = Buffer.from(await res.arrayBuffer());
    // YouTube 404 placeholder는 120×90 — 실제 썸네일인지 확인
    if (buf.length < 5000 && quality !== 'hqdefault') continue;
    await sharp(buf)
      .resize({ width: 2400, withoutEnlargement: true })
      .jpeg({ quality: 80 })
      .toFile(path.join(dir, 'cover.jpg'));
    return coverPath;
  }
  return null;
}

async function main() {
  if (!NOTION_TOKEN || !DATABASE_ID) {
    console.log('[notion-sync] NOTION_TOKEN / NOTION_DATABASE_ID 없음 — 동기화 스킵, 기존 데이터로 빌드 계속');
    return;
  }

  console.log('[notion-sync] 노션 DB 조회 중...');
  const rows = await queryAllRows();
  const overrides = {};
  const slugsSeen = new Set();

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

    const slug = LEGACY_SLUGS[title] || autoSlug(title, row.id);

    if (slugsSeen.has(slug)) {
      console.log(`[notion-sync] "${title}": slug "${slug}" 중복 — 건너뜀`);
      continue;
    }
    slugsSeen.add(slug);

    const tags = (props['태그']?.multi_select || []).map(t => t.name);
    const period = formatPeriod(props['\b기간']?.date);
    const link = props['링크 URL']?.url || null;

    let images = [];

    try {
      if (category === 'aivideo') {
        // AI Video: YouTube 썸네일을 cover로 사용 (라이트박스는 iframe embed)
        const videoId = extractYouTubeId(link);
        if (videoId) {
          const coverPath = await saveYouTubeThumbnail(slug, videoId, category);
          if (coverPath) {
            images = [coverPath];
            console.log(`[notion-sync] ${slug} (${category}): YouTube 썸네일 저장`);
          }
        }
      } else {
        // UIUX / Branding: 페이지 내 모든 이미지를 슬라이드로 저장
        const imageUrls = await findAllImageUrls(row.id);
        if (imageUrls.length) {
          images = await saveImages(slug, imageUrls, category);
          console.log(`[notion-sync] ${slug} (${category}): 이미지 ${images.length}장 저장`);
        }
      }
    } catch (err) {
      console.warn(`[notion-sync] ${slug}: 이미지 처리 실패 — ${err.message}`);
    }

    overrides[slug] = { title, tags, period, category, subtype, link, images };
  }

  await mkdir(path.join(ROOT, 'data'), { recursive: true });
  const js = `window.NOTION_OVERRIDES = ${JSON.stringify(overrides, null, 2)};\n`;
  await writeFile(path.join(ROOT, 'data', 'notion-data.js'), js);
  console.log(`[notion-sync] 완료 — ${Object.keys(overrides).length}개 프로젝트 동기화`);
}

main().catch(err => {
  console.error('[notion-sync] 실패 (빌드는 계속 진행):', err.message);
});
