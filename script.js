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
    images: ['images/uiux/luckyslot/01.jpg'],
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
// 기간("시작 → 종료")의 종료일 기준으로 최신순 정렬. 기간 없으면 뒤로.
function endDate(p) {
  const end = (p.period || '').split('→').pop().trim();
  return end ? end.replace(/\//g, '') : '0';
}

function projectsOf(category) {
  return PROJECTS
    .filter(p => p.category === category)
    .sort((a, b) => endDate(b).localeCompare(endDate(a)));
}

function tagChip(name) {
  const span = document.createElement('span');
  span.className = 'tag ' + (TAG_CLASS[name] || 'tag-side');
  span.textContent = name;
  return span;
}

function thumbHTML(p) {
  // 커버 이미지가 준비되면 images/<category>/<id>/cover.jpg 로 자동 표시됩니다.
  const cover = `images/${p.category}/${p.id}/cover.jpg`;
  return `<img src="${cover}" alt="${p.title}" loading="lazy"
            onerror="this.style.display='none';this.parentElement.classList.add('no-image')" />`;
}

// ===== 홈 카드 (작은 그리드) =====
function homeCard(p) {
  const card = document.createElement('a');
  card.className = 'project-card';
  card.href = `#project/${p.id}`;

  const tags = p.tags.map(t => `<span class="tag ${TAG_CLASS[t] || 'tag-side'}">${t}</span>`).join('');
  card.innerHTML = `
    <div class="project-thumb">${thumbHTML(p)}</div>
    <div class="project-info">
      <h3 class="project-name">${p.title}</h3>
      <div class="card-tags">${tags}</div>
      ${p.period ? `<p class="project-period">${p.period}</p>` : ''}
    </div>`;
  return card;
}

// ===== 카테고리 카드 (큰 2열 그리드) =====
function bigCard(p) {
  const card = document.createElement('a');
  card.className = 'big-card';
  card.href = `#project/${p.id}`;

  const tags = p.tags.map(t => `<span class="tag ${TAG_CLASS[t] || 'tag-side'}">${t}</span>`).join('');
  card.innerHTML = `
    <div class="big-thumb">${thumbHTML(p)}</div>
    <div class="big-info">
      <h3 class="big-name">${p.title}</h3>
      <div class="card-tags">${tags}</div>
      ${p.period ? `<p class="project-period">${p.period}</p>` : ''}
    </div>`;
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

function renderDetail(id) {
  const p = PROJECTS.find(x => x.id === id);
  if (!p) { location.hash = ''; return; }

  document.getElementById('detailBack').href = `#${p.category}`;

  const tagsEl = document.getElementById('detailTags');
  tagsEl.innerHTML = '';
  p.tags.forEach(t => tagsEl.appendChild(tagChip(t)));

  document.getElementById('detailTitle').textContent = p.title;
  document.getElementById('detailPeriod').textContent = p.period || '';

  document.getElementById('detailDesc').textContent = p.desc;

  const imagesEl = document.getElementById('detailImages');
  imagesEl.innerHTML = '';
  (p.images || []).forEach(src => {
    const img = document.createElement('img');
    img.src = src;
    img.alt = p.title;
    img.loading = 'lazy';
    img.onerror = () => img.remove();
    imagesEl.appendChild(img);
  });
}

// ===== 라우터 =====
const views = {
  home: document.getElementById('view-home'),
  category: document.getElementById('view-category'),
  detail: document.getElementById('view-detail'),
};

function showView(name) {
  Object.entries(views).forEach(([k, el]) => { el.hidden = (k !== name); });
}

function route() {
  const hash = location.hash.slice(1); // '' | 'about' | 'uiux' | 'project/xxx'

  if (hash.startsWith('project/')) {
    const id = hash.split('/')[1];
    showView('detail');
    renderDetail(id);
    window.scrollTo(0, 0);
    return;
  }

  if (hash === 'uiux' || hash === 'aivideo' || hash === 'branding') {
    showView('category');
    renderCategory(hash);
    window.scrollTo(0, 0);
    return;
  }

  // 홈 (about 포함)
  showView('home');
  if (hash === 'about') {
    document.getElementById('about').scrollIntoView({ behavior: 'smooth' });
  } else {
    window.scrollTo(0, 0);
  }
}

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

applyTheme(localStorage.getItem('theme') || 'light');

themeToggle.addEventListener('click', () => {
  const next = document.body.classList.contains('dark') ? 'light' : 'dark';
  localStorage.setItem('theme', next);
  applyTheme(next);
});

// ===== 초기화 =====
renderHome();
window.addEventListener('hashchange', route);
route();
