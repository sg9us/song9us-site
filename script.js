// ===== 프로젝트 데이터 =====
// desc: 카드 설명 문구, 추후 UI 노출 예정, 현재는 렌더링 미사용
const PROJECTS = [
  {
    id: 'meetup-flow',
    category: 'uiux',
    title: '모임 서비스 신청&개설 Flow UX 개선',
    tags: ['PC web', '사이드 프로젝트'],
    period: '2024/09/01 → 2024/10/01',
    desc: '프로젝트 상세 설명을 여기에 입력하세요.',
    images: ['images/uiux/meetup-flow/cover.jpg'],
  },
  {
    id: 'retention',
    category: 'uiux',
    title: '약 700명 동아리 회원들의 연결을 목표로 앱 리텐션 증가',
    tags: ['Mobile App', '사이드 프로젝트'],
    period: '2023/12/18 → 2024/01/19',
    desc: '프로젝트 상세 설명을 여기에 입력하세요.',
    images: [
      'images/uiux/retention/01.jpg',
      'images/uiux/retention/02.jpg',
      'images/uiux/retention/03.jpg',
      'images/uiux/retention/04.jpg',
      'images/uiux/retention/05.jpg',
    ],
  },
  {
    id: 'edu-platform',
    category: 'uiux',
    title: '기업 교육 플랫폼 & 관리자 페이지',
    tags: ['Mobile Web', 'PC web', '실무 프로젝트'],
    period: '2023/11/01 → 2023/12/01',
    desc: '프로젝트 상세 설명을 여기에 입력하세요.',
    images: ['images/uiux/edu-platform/cover.jpg'],
  },
  {
    id: 'tutice',
    category: 'uiux',
    title: '과외관리의 표준, 튜티스 Tutice',
    tags: ['Mobile Web', '사이드 프로젝트'],
    period: '2023/06/24 → 2023/07/22',
    desc: '프로젝트 상세 설명을 여기에 입력하세요.',
    images: ['images/uiux/tutice/cover.jpg'],
  },
  {
    id: 'teamup',
    category: 'uiux',
    title: '팀워크를 위한 익명 칭찬 투표 앱, Team Up',
    tags: ['Mobile App', '사이드 프로젝트'],
    period: '2023/04/01 → 2023/04/30',
    desc: '프로젝트 상세 설명을 여기에 입력하세요.',
    images: ['images/uiux/teamup/cover.jpg'],
  },
  {
    id: 'luckyslot',
    category: 'uiux',
    title: '시즈널 바이럴 서비스, 럭키슬롯',
    tags: ['Mobile Web', '사이드 프로젝트'],
    period: '2022/10/01 → 2023/01/30',
    desc: '프로젝트 상세 설명을 여기에 입력하세요.',
    images: ['images/uiux/luckyslot/cover.jpg'],
  },

];

// 빌드 시 노션에서 가져온 데이터로 덮어쓰기 + 신규 프로젝트 추가
if (typeof NOTION_OVERRIDES !== 'undefined') {
  PROJECTS.forEach(p => {
    const o = NOTION_OVERRIDES[p.id];
    if (o) Object.assign(p, o);
  });
  // PROJECTS에 없는 신규 노션 항목을 동적으로 추가
  const existingIds = new Set(PROJECTS.map(p => p.id));
  Object.entries(NOTION_OVERRIDES).forEach(([slug, data]) => {
    if (!existingIds.has(slug)) {
      PROJECTS.push({ id: slug, images: [`images/${data.category}/${slug}/cover.jpg`], ...data });
    }
  });
}

const CATEGORY_LABEL = { uiux: 'UI/UX', aivideo: 'AI Video', branding: 'Branding', article: 'Article' };

const TAG_CLASS = {
  'PC web': 'tag-pcweb',
  'Mobile Web': 'tag-mweb',
  'Mobile App': 'tag-mapp',
  'AI Video': 'tag-aivideo',
  'Branding': 'tag-branding',
  '실무 프로젝트': 'tag-work',
  '사이드 프로젝트': 'tag-side',
};

// YouTube URL → 영상 ID (11자리)
// 주의: 동일 로직이 scripts/fetch-notion.mjs에도 있음 — 수정 시 두 파일 함께 변경
function extractYouTubeId(url) {
  if (!url) return null;
  const m = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/);
  return m ? m[1] : null;
}

// ===== 헬퍼 =====
function endDate(p) {
  const end = (p.period || '').split('→').pop().trim();
  return end ? end.replace(/\//g, '') : '0';
}

function projectsOf(category) {
  return PROJECTS
    .filter(p => p.category === category)
    .sort((a, b) => endDate(b).localeCompare(endDate(a)));
}

// eager: 뷰포트 최초 노출 카드에 true (LCP 최적화)
// w/h: 이미지 고유 비율 힌트 → 브라우저가 CSS 적용 전에 공간 예약해 레이아웃 시프트 방지
function thumbHTML(p, { eager = false, w = '16', h = '9' } = {}) {
  const cover = p.images?.[0] || `images/${p.category}/${p.id}/cover.jpg`;
  return `<img src="${cover}" alt="${p.title}" loading="${eager ? 'eager' : 'lazy'}"
            width="${w}" height="${h}"
            onerror="this.style.display='none';this.parentElement.classList.add('no-image')" />`;
}

function tagsHTML(tags) {
  return tags.map(t => `<span class="tag ${TAG_CLASS[t] || 'tag-side'}">${t}</span>`).join('');
}

// ===== 홈 카드 =====
function homeCard(p, eager = false) {
  const card = document.createElement('div');
  card.className = 'project-card';
  card.innerHTML = `
    <div class="project-thumb">${thumbHTML(p, { eager })}</div>
    <div class="project-info">
      <h3 class="project-name">${p.title}</h3>
      <div class="card-tags">${tagsHTML(p.tags)}</div>
      ${p.period ? `<p class="project-period">${p.period}</p>` : ''}
    </div>`;
  card.addEventListener('click', () => openLightbox(p.id));
  return card;
}

// ===== UI/UX 카테고리 카드 (2열 큰 그리드) =====
function bigCard(p) {
  const card = document.createElement('div');
  card.className = 'big-card';
  card.innerHTML = `
    <div class="big-thumb">${thumbHTML(p, { w: '16', h: '9' })}</div>
    <div class="big-info">
      <h3 class="big-name">${p.title}</h3>
      <div class="card-tags">${tagsHTML(p.tags)}</div>
      ${p.period ? `<p class="project-period">${p.period}</p>` : ''}
    </div>`;
  card.addEventListener('click', () => openLightbox(p.id));
  return card;
}

// ===== AI Video 카드 =====
function avCard(p, eager = false) {
  const is916 = p.subtype === '9:16';
  const pending = !p.link;
  const card = document.createElement('div');
  card.className = `av-card${pending ? ' pending' : ''}`;

  card.innerHTML = `
    <div class="${is916 ? 'av-thumb-916' : 'av-thumb-169'}">
      ${thumbHTML(p, is916 ? { eager, w: '9', h: '16' } : { eager, w: '16', h: '9' })}
      ${pending ? '<span class="badge-pending">준비중</span>' : ''}
    </div>
    <div class="av-info">
      <h3 class="av-name">${p.title}</h3>
      <div class="card-tags">${tagsHTML(p.tags)}</div>
      ${p.period ? `<p class="project-period">${p.period}</p>` : ''}
    </div>`;

  if (p.link) {
    card.addEventListener('click', () => openLightbox(p.id));

    // 데스크톱 호버 미리보기 — hover 미지원(터치) 기기에서는 건너뜀
    const videoId = extractYouTubeId(p.link);
    if (videoId && window.matchMedia('(hover: hover)').matches) {
      const thumbClass = is916 ? 'av-thumb-916' : 'av-thumb-169';
      let previewIframe = null;
      let stopTimer = null;

      const stopPreview = () => {
        clearTimeout(stopTimer);
        if (!previewIframe) return;
        const img = card.querySelector('.' + thumbClass + ' img');
        if (img) img.style.display = '';
        previewIframe.remove();
        previewIframe = null;
      };

      card.addEventListener('mouseenter', () => {
        const thumbDiv = card.querySelector('.' + thumbClass);
        const img = thumbDiv?.querySelector('img');
        if (!img || previewIframe) return;
        img.style.display = 'none';
        previewIframe = document.createElement('iframe');
        previewIframe.setAttribute('allow', 'autoplay');
        previewIframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0&playsinline=1`;
        previewIframe.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;border:none;pointer-events:none;';
        thumbDiv.appendChild(previewIframe);
        stopTimer = setTimeout(stopPreview, 4000);
      });

      card.addEventListener('mouseleave', stopPreview);
    }
  }
  return card;
}

// ===== Article 카드: homeCard와 동일 비주얼, 클릭 시 링크 → 새 탭 / 없으면 라이트박스 =====
function articleCard(p, eager = false) {
  const card = document.createElement('div');
  card.className = 'project-card';
  card.innerHTML = `
    <div class="project-thumb">${thumbHTML(p, { eager })}</div>
    <div class="project-info">
      <h3 class="project-name">${p.title}</h3>
      <div class="card-tags">${tagsHTML(p.tags)}</div>
      ${p.period ? `<p class="project-period">${p.period}</p>` : ''}
    </div>`;
  card.addEventListener('click', () => {
    if (p.link) window.open(p.link, '_blank', 'noopener,noreferrer');
    else openLightbox(p.id);
  });
  return card;
}

// ===== Branding 카드 (1:1) =====
function brandingCard(p) {
  const card = document.createElement('div');
  card.className = 'branding-card';
  card.innerHTML = `
    <div class="branding-thumb">${thumbHTML(p, { w: '1', h: '1' })}</div>
    <div class="branding-info">
      <h3 class="branding-name">${p.title}</h3>
      <div class="card-tags">${tagsHTML(p.tags)}</div>
      ${p.period ? `<p class="project-period">${p.period}</p>` : ''}
    </div>`;
  card.addEventListener('click', () => openLightbox(p.id));
  return card;
}

// ===== 렌더 =====
function renderHome() {
  const ui = document.getElementById('homeUiux');
  const av = document.getElementById('homeAivideo');
  const br = document.getElementById('homeBranding');
  const ar = document.getElementById('homeArticle');
  ui.innerHTML = '';
  av.innerHTML = '';
  br.innerHTML = '';
  ar.innerHTML = '';

  // 카테고리별 목록 (정렬 포함) — 이후 length와 slice 모두 이 변수에서 파생
  const uiList = projectsOf('uiux');
  const avList = projectsOf('aivideo');
  const brList = projectsOf('branding');
  const arList = projectsOf('article');

  // 섹션 타이틀에 총 프로젝트 개수 표시
  const setCount = (id, label, count) => {
    document.getElementById(id).innerHTML =
      `${label}<span class="works-count"> · ${count}</span>`;
  };
  setCount('titleUiux',     'UI/UX',    uiList.length);
  setCount('titleAivideo',  'AI Video', avList.length);
  setCount('titleBranding', 'Branding', brList.length);
  setCount('titleArticle',  'Article',  arList.length);

  // UI/UX: 첫 번째 카드는 eager 로딩(뷰포트 최초 노출)
  uiList.slice(0, 4).forEach((p, i) => ui.appendChild(homeCard(p, i === 0)));

  // AI Video: 9:16 행(6열) 먼저, 16:9 행(4열)
  av.className = 'av-sections';
  const av916 = avList.filter(p => p.subtype === '9:16');
  const av169 = avList.filter(p => p.subtype !== '9:16');
  const makeAvRow = (items, gridClass, limit, eager = false) => {
    if (!items.length) return;
    const row = document.createElement('div');
    row.className = gridClass;
    items.slice(0, limit).forEach(p => row.appendChild(avCard(p, eager)));
    av.appendChild(row);
  };
  makeAvRow(av916, 'av-grid-916-home', 6, true); // 홈 전용 6열 그리드
  makeAvRow(av169, 'av-grid-169', 4, true);

  // Branding: brandingCard 재사용
  br.className = 'branding-grid';
  brList.slice(0, 6).forEach(p => br.appendChild(brandingCard(p)));

  // Article: articleCard 재사용 (링크 있으면 새 탭, 없으면 라이트박스)
  arList.slice(0, 4).forEach(p => ar.appendChild(articleCard(p)));

  observeFadeIn(document.getElementById('view-home'));
}

function renderCategory(category) {
  document.getElementById('catTitle').textContent = CATEGORY_LABEL[category] || category;
  const list = projectsOf(category);
  document.getElementById('catCount').textContent = `${list.length} projects`;
  const grid = document.getElementById('catGrid');
  grid.innerHTML = '';

  if (category === 'aivideo') {
    grid.className = 'av-sections';
    const longform = list.filter(p => p.subtype !== '9:16');
    const shorts   = list.filter(p => p.subtype === '9:16');

    const makeSection = (label, items, rowClass) => {
      if (!items.length) return;
      const sec = document.createElement('div');
      const h = document.createElement('p');
      h.className = 'av-subheading';
      h.textContent = label;
      const row = document.createElement('div');
      row.className = rowClass;
      items.forEach(p => row.appendChild(avCard(p)));
      sec.appendChild(h);
      sec.appendChild(row);
      grid.appendChild(sec);
    };

    makeSection('Video · 16:9', longform, 'av-grid-169');
    makeSection('Shorts · 9:16',   shorts,   'av-grid-916');
  } else if (category === 'branding') {
    grid.className = 'branding-grid';
    list.forEach(p => grid.appendChild(brandingCard(p)));
  } else if (category === 'article') {
    grid.className = 'article-grid';
    list.forEach(p => grid.appendChild(articleCard(p)));
  } else {
    grid.className = 'big-grid';
    list.forEach(p => grid.appendChild(bigCard(p)));
  }

  observeFadeIn(document.getElementById('view-category'));
}

// ===== 라우터 =====
const views = {
  home: document.getElementById('view-home'),
  category: document.getElementById('view-category'),
  career: document.getElementById('view-career'),
};

function showView(name) {
  Object.entries(views).forEach(([k, el]) => { el.hidden = (k !== name); });
}

function route() {
  const hash = location.hash.slice(1);

  if (hash === 'uiux' || hash === 'aivideo' || hash === 'branding' || hash === 'article') {
    showView('category');
    renderCategory(hash);
    window.scrollTo(0, 0);
    return;
  }

  if (hash === 'career') {
    showView('career');
    window.scrollTo(0, 0);
    return;
  }

  showView('home');
  if (hash === 'about') {
    document.getElementById('about').scrollIntoView({ behavior: 'smooth' });
  } else {
    window.scrollTo(0, 0);
  }
}

// 로고 클릭 → 항상 홈으로
document.querySelector('.nav-logo').addEventListener('click', e => {
  e.preventDefault();
  history.pushState(null, '', location.pathname);
  showView('home');
  window.scrollTo(0, 0);
});

// ===== 라이트박스 =====
let lbImages = [];
let lbIndex = 0;
let lbTouchStartX = 0;

const lb = document.getElementById('lightbox');
const lbImg = lb.querySelector('.lb-img');
const lbImgWrap = lb.querySelector('.lb-img-wrap');
const lbVideoWrap = lb.querySelector('.lb-video-wrap');
const lbIframe = lb.querySelector('.lb-iframe');
const lbCounter = lb.querySelector('.lb-counter');
const lbPrev = lb.querySelector('.lb-prev');
const lbNext = lb.querySelector('.lb-next');
const lbBackdrop = lb.querySelector('.lb-backdrop');
const lbClose = lb.querySelector('.lb-close');

function gtag_event(name, params) {
  if (typeof gtag === 'function') gtag('event', name, params);
}

function openLightbox(projectId) {
  const p = PROJECTS.find(x => x.id === projectId);
  if (!p) return;

  // AI Video: YouTube iframe embed
  if (p.category === 'aivideo') {
    const videoId = extractYouTubeId(p.link);
    if (videoId) {
      lbImgWrap.hidden = true;
      lbVideoWrap.hidden = false;
      lbPrev.hidden = true;
      lbNext.hidden = true;
      lbCounter.textContent = '';
      lbVideoWrap.dataset.ratio = p.subtype === '9:16' ? '9/16' : '16/9';
      lbIframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
      lb.hidden = false;
      document.body.style.overflow = 'hidden';
      gtag_event('video_play', { project_id: p.id, project_title: p.title });
    }
    return;
  }

  // 이미지 슬라이더
  if (!p.images?.length) return;
  lbImgWrap.hidden = false;
  lbVideoWrap.hidden = true;
  lbPrev.hidden = false;
  lbNext.hidden = false;
  lbImages = p.images;
  showSlide(0);
  lb.hidden = false;
  document.body.style.overflow = 'hidden';
  gtag_event('project_view', { project_id: p.id, project_title: p.title, project_category: p.category });
}

function closeLightbox() {
  lb.hidden = true;
  document.body.style.overflow = '';
  lbIframe.src = '';  // 영상 재생 중단
}

function showSlide(i, isNav = false) {
  if (isNav) gtag_event('lightbox_navigate', { slide_index: i + 1, total_slides: lbImages.length });
  lbIndex = i;
  lbImg.src = lbImages[i];
  lbCounter.textContent = `${i + 1} / ${lbImages.length}`;
  lbPrev.disabled = i === 0;
  lbNext.disabled = i === lbImages.length - 1;
}

lbBackdrop.addEventListener('click', closeLightbox);
lbClose.addEventListener('click', closeLightbox);
lbPrev.addEventListener('click', () => { if (lbIndex > 0) showSlide(lbIndex - 1, true); });
lbNext.addEventListener('click', () => { if (lbIndex < lbImages.length - 1) showSlide(lbIndex + 1, true); });

document.addEventListener('keydown', e => {
  if (lb.hidden) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft' && lbIndex > 0) showSlide(lbIndex - 1, true);
  if (e.key === 'ArrowRight' && lbIndex < lbImages.length - 1) showSlide(lbIndex + 1, true);
});

lb.addEventListener('touchstart', e => { lbTouchStartX = e.touches[0].clientX; }, { passive: true });
lb.addEventListener('touchend', e => {
  if (!lbVideoWrap.hidden) return; // 영상 재생 중 스와이프 무시
  const dx = e.changedTouches[0].clientX - lbTouchStartX;
  if (Math.abs(dx) < 40) return;
  if (dx < 0 && lbIndex < lbImages.length - 1) showSlide(lbIndex + 1, true);
  if (dx > 0 && lbIndex > 0) showSlide(lbIndex - 1, true);
}, { passive: true });

// ===== 등장 애니메이션 =====
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.08 });

function observeFadeIn(root) {
  root.querySelectorAll('.project-card, .big-card, .av-card, .branding-card, .about-col, .contact-col').forEach(el => {
    if (!el.classList.contains('fade-in')) {
      el.classList.add('fade-in');
      observer.observe(el);
    }
  });
}

// ===== 스크롤 시 네비게이션 테두리 =====
const nav = document.querySelector('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 20);
});

// ===== 테마 토글 =====
const themeToggle = document.getElementById('themeToggle');
const themeIcon = themeToggle.querySelector('.theme-icon');

function applyTheme(theme) {
  const dark = theme === 'dark';
  document.body.classList.toggle('dark', dark);
  themeIcon.textContent = dark ? '☀️' : '🌙';
}

applyTheme(localStorage.getItem('theme') || 'dark');

themeToggle.addEventListener('click', () => {
  const next = document.body.classList.contains('dark') ? 'light' : 'dark';
  localStorage.setItem('theme', next);
  applyTheme(next);
});

// ===== Contact Form =====
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  const submitBtn    = document.getElementById('contactSubmit');
  const nameInput    = document.getElementById('contactName');
  const subjectInput = document.getElementById('contactSubject');
  const successMsg   = document.getElementById('contactSuccess');
  const errorMsg     = document.getElementById('contactError');

  contactForm.addEventListener('submit', async e => {
    e.preventDefault();
    if (!contactForm.checkValidity()) {
      contactForm.reportValidity();
      return;
    }

    const msgPreview = (contactForm.elements['message'].value || '')
      .replace(/\s+/g, ' ').trim().slice(0, 40);
    subjectInput.value = `새 문의 | ${nameInput.value.trim()} | ${msgPreview}`;
    submitBtn.disabled = true;
    submitBtn.textContent = '전송 중...';
    successMsg.hidden = true;
    errorMsg.hidden = true;

    try {
      const res = await fetch(contactForm.action, {
        method: 'POST',
        body: new FormData(contactForm),
        headers: { Accept: 'application/json' },
      });
      if (res.ok) {
        contactForm.reset();
        successMsg.hidden = false;
      } else {
        errorMsg.hidden = false;
      }
    } catch {
      errorMsg.hidden = false;
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = '보내기';
    }
  });
}

// ===== 초기화 =====
renderHome();
window.addEventListener('hashchange', route);
route();
