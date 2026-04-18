// 스크롤 시 네비게이션 테두리
const nav = document.querySelector('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 20);
});

// 모달
const modal = document.getElementById('modal');
const modalClose = document.getElementById('modalClose');

document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('click', () => {
    document.getElementById('modalTag').textContent = card.dataset.tag;
    document.getElementById('modalTitle').textContent = card.dataset.title;
    document.getElementById('modalDesc').textContent = card.dataset.desc;

    const imagesEl = document.getElementById('modalImages');
    imagesEl.innerHTML = '';
    const images = JSON.parse(card.dataset.images || '[]');
    images.forEach(src => {
      const img = document.createElement('img');
      img.src = src;
      img.alt = card.dataset.title;
      imagesEl.appendChild(img);
    });

    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  });
});

modalClose.addEventListener('click', closeModal);
modal.addEventListener('click', (e) => {
  if (e.target === modal) closeModal();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});

function closeModal() {
  modal.classList.remove('open');
  document.body.style.overflow = '';
}

// 등장 애니메이션
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.08 });

document.querySelectorAll('.project-card, .about-text, .about-skills, .contact-form').forEach(el => {
  el.classList.add('fade-in');
  observer.observe(el);
});
