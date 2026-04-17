// 스크롤 시 네비게이션 테두리 표시
const nav = document.querySelector('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 20);
});

// 섹션 등장 애니메이션
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.hero-title, .project-card, .about-text, .about-skills, .contact-email').forEach(el => {
  el.classList.add('fade-in');
  observer.observe(el);
});
