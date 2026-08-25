// ===== 프로젝트 데이터 (최신순으로 정렬) =====
const PROJECTS = [
  {
    id: 'content-review',
    category: 'uiux',
    title: '검수 과정 3단계 단축하고 반복해서 사용성 검증하기',
    tags: ['실무 프로젝트'],
    period: '2023/05/01 → 2023/07/01',
    desc: '\'AI 디지털 교과서\'에 사용되는 콘텐츠 카드의 메타데이터, 기능, 디자인 검수를 위한 인터널 프로덕트 제작.',
    images: ['images/uiux/content-review/cover.jpg'],
  },
  {
    id: 'meetup-flow',
    category: 'uiux',
    title: '모임 서비스 신청&개설 Flow UX 개선',
    tags: ['PC web', '사이드 프로젝트'],
    period: '2024/09/01 → 2024/10/01',
    desc: '프로젝트 상세 설명을 여기에 입력하세요.',
    images: ['images/uiux/meetup-flow/01.jpg'],
  },
  {
    id: 'learnify',
    category: 'uiux',
    title: '500만명의 학생을 위한 500만개의 AI 교과서, 러니파이',
    tags: ['PC web', '실무 프로젝트'],
    period: '2023/10/01 → 2024/06/01',
    desc: '프로젝트 상세 설명을 여기에 입력하세요.',
    images: [
      'images/uiux/learnify/01.jpg',
      'images/uiux/learnify/02.jpg',
      'images/uiux/learnify/03.jpg',
      'images/uiux/learnify/04.jpg',
      'images/uiux/learnify/05.jpg',
    ],
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
    images: ['images/uiux/edu-platform/01.jpg'],
  },
  {
    id: 'tutice',
    category: 'uiux',
    title: '과외관리의 표준, 튜티스 Tutice',
    tags: ['Mobile Web', '사이드 프로젝트'],
    period: '2023/06/24 → 2023/07/22',
    desc: '프로젝트 상세 설명을 여기에 입력하세요.',
    images: ['images/uiux/tutice/01.jpg'],
  },
  {
    id: 'teamup',
    category: 'uiux',
    title: '팀워크를 위한 익명 칭찬 투표 앱, Team Up',
    tags: ['Mobile App', '사이드 프로젝트'],
    period: '2023/04/01 → 2023/04/30',
    desc: '프로젝트 상세 설명을 여기에 입력하세요.',
    images: ['images/uiux/teamup/01.jpg'],
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

  // ===== AI Video (임시 — 실제 내용으로 교체 예정) =====
  {
    id: 'aivideo-a',
    category: 'aivideo',
    title: 'AI 영상 제목 A',
    tags: ['AI Video'],
    period: '',
    desc: 'AI Video 프로젝트 설명을 여기에 입력하세요.',
    images: ['images/aivideo/aivideo-a/01.jpg'],
  },
  {
    id: 'aivideo-b',
    category: 'aivideo',
    title: 'AI 영상 제목 B',
    tags: ['AI Video'],
    period: '',
    desc: 'AI Video 프로젝트 설명을 여기에 입력하세요.',
    images: ['images/aivideo/aivideo-b/01.jpg'],
  },

  // ===== Branding (임시 — 실제 내용으로 교체 예정) =====
  {
    id: 'branding-a',
    category: 'branding',
    title: '브랜딩 프로젝트 제목 A',
    tags: ['Branding'],
    period: '',
    desc: '브랜딩 프로젝트 설명을 여기에 입력하세요.',
    images: ['images/branding/branding-a/01.jpg'],
  },
  {
    id: 'branding-b',
    category: 'branding',
    title: '브랜딩 프로젝트 제목 B',
    tags: ['Branding'],
    period: '',
    desc: '브랜딩 프로젝트 설명을 여기에 입력하세요.',
    images: ['images/branding/branding-b/01.jpg'],
  },
];

// 빌드 시 노션에서 가져온 제목/태그/기간으로 덮어쓰기 (데이터/이미지는 그대로 유지)
if (typeof NOTION_OVERRIDES !== 'undefined') {
  PROJECTS.forEach(p => {
    const o = NOTION_OVERRIDES[p.id];
    if (o) Object.assign(p, o);
  });
}

const CATEGORY_LABEL = { uiux: 'UI/UX', aivideo: 'AI Video', branding: 'Branding' };

const TAG_CLASS = {
  'PC web': 'tag-pcweb',
  'Mobile Web': 'tag-mweb',
  'Mobile App': 'tag-mapp',
  'AI Video': 'tag-aivideo',
  'Branding': 'tag-branding',
  '실무 프로젝트': 'tag-work',
  '사이드 프로젝트': 'tag-side',
};

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

function thumbHTML(p) {
  const cover = `images/${p.category}/${p.id}/cover.jpg`;
  return `<img src="${cover}" alt="${p.title}" loading="lazy"
            onerror="this.style.display='none';this.parentElement.classList.add('no-image')" />`;
}

// ===== 홈 카드 (작은 그리드) =====
function homeCard(p) {
  const card = document.createElement('div');
  card.className = 'project-card';

  const tags = p.tags.map(t => `<span class="tag ${TAG_CLASS[t] || 'tag-side'}">${t}</span>`).join('');
  card.innerHTML = `
    <div class="project-thumb">${thumbHTML(p)}</div>
    <div class="project-info">
      <h3 class="project-name">${p.title}</h3>
      <div class="card-tags">${tags}</div>
      ${p.period ? `<p class="project-period">${p.period}</p>` : ''}
    </div>`;
  card.addEventListener('click', () => openLightbox(p.id));
  return card;
}

// ===== 카테고리 카드 (큰 2열 그리드) =====
function bigCard(p) {
  const card = document.createElement('div');
  card.className = 'big-card';

  const tags = p.tags.map(t => `<span class="tag ${TAG_CLASS[t] || 'tag-side'}">${t}</span>`).join('');
  card.innerHTML = `
    <div class="big-thumb">${thumbHTML(p)}</div>
    <div class="big-info">
      <h3 class="big-name">${p.title}</h3>
      <div class="card-tags">${tags}</div>
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
  ui.innerHTML = '';
  av.innerHTML = '';
  br.innerHTML = '';
  projectsOf('uiux').slice(0, 4).forEach(p => ui.appendChild(homeCard(p)));
  projectsOf('aivideo').slice(0, 4).forEach(p => av.appendChild(homeCard(p)));
  projectsOf('branding').slice(0, 4).forEach(p => br.appendChild(homeCard(p)));
  observeFadeIn(document.getElementById('view-home'));
}

function renderCategory(category) {
  document.getElementById('catTitle').textContent = CATEGORY_LABEL[category] || category;
  const list = projectsOf(category);
  document.getElementById('catCount').textContent = `${list.length} projects`;
  const grid = document.getElementById('catGrid');
  grid.innerHTML = '';
  list.forEach(p => grid.appendChild(bigCard(p)));
  observeFadeIn(document.getElementById('view-category'));
}

// ===== 라우터 =====
const views = {
  home: document.getElementById('view-home'),
  category: document.getElementById('view-category'),
};

function showView(name) {
  Object.entries(views).forEach(([k, el]) => { el.hidden = (k !== name); });
}

function route() {
  const hash = location.hash.slice(1);

  if (hash === 'uiux' || hash === 'aivideo' || hash === 'branding') {
    showView('category');
    renderCategory(hash);
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

// ===== 라이트박스 =====
let lbImages = [];
let lbIndex = 0;
let lbTouchStartX = 0;

const lb = document.getElementById('lightbox');
const lbImg = lb.querySelector('.lb-img');
const lbCounter = lb.querySelector('.lb-counter');
const lbPrev = lb.querySelector('.lb-prev');
const lbNext = lb.querySelector('.lb-next');
const lbBackdrop = lb.querySelector('.lb-backdrop');
const lbClose = lb.querySelector('.lb-close');

function openLightbox(projectId) {
  const p = PROJECTS.find(x => x.id === projectId);
  if (!p || !p.images?.length) return;
  lbImages = p.images;
  showSlide(0);
  lb.hidden = false;
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lb.hidden = true;
  document.body.style.overflow = '';
}

function showSlide(i) {
  lbIndex = i;
  lbImg.src = lbImages[i];
  lbCounter.textContent = `${i + 1} / ${lbImages.length}`;
  lbPrev.disabled = i === 0;
  lbNext.disabled = i === lbImages.length - 1;
}

lbBackdrop.addEventListener('click', closeLightbox);
lbClose.addEventListener('click', closeLightbox);
lbPrev.addEventListener('click', () => { if (lbIndex > 0) showSlide(lbIndex - 1); });
lbNext.addEventListener('click', () => { if (lbIndex < lbImages.length - 1) showSlide(lbIndex + 1); });

document.addEventListener('keydown', e => {
  if (lb.hidden) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft' && lbIndex > 0) showSlide(lbIndex - 1);
  if (e.key === 'ArrowRight' && lbIndex < lbImages.length - 1) showSlide(lbIndex + 1);
});

lb.addEventListener('touchstart', e => { lbTouchStartX = e.touches[0].clientX; }, { passive: true });
lb.addEventListener('touchend', e => {
  const dx = e.changedTouches[0].clientX - lbTouchStartX;
  if (Math.abs(dx) < 40) return;
  if (dx < 0 && lbIndex < lbImages.length - 1) showSlide(lbIndex + 1);
  if (dx > 0 && lbIndex > 0) showSlide(lbIndex - 1);
}, { passive: true });

// ===== 등장 애니메이션 =====
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.08 });

function observeFadeIn(root) {
  root.querySelectorAll('.project-card, .big-card, .about-col, .contact-col').forEach(el => {
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

// ===== 초기화 =====
renderHome();
window.addEventListener('hashchange', route);
route();
