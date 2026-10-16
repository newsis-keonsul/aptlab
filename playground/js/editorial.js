'use strict';

// 기존 main.js의 사진·영상·그래픽 전환과 독립적으로 추가 장면만 제어합니다.
(() => {
  // PHOTO 06: 버튼·키보드·스와이프로 넘기는 수동 슬라이드. 자동으로 사진을 바꾸지 않습니다.
  document.querySelectorAll('.photo-carousel').forEach(carousel => {
    const slides = [...carousel.querySelectorAll('.carousel-slide')];
    const viewport = carousel.querySelector('.carousel-viewport');
    const current = carousel.querySelector('.carousel-current');
    let index = 0;
    let touchStart = null;
    if (slides.length < 2) return;
    const showSlide = nextIndex => {
      index = (nextIndex + slides.length) % slides.length;
      carousel.style.setProperty('--carousel-index', index);
      slides.forEach((slide, position) => slide.setAttribute('aria-hidden', String(position !== index)));
      current.textContent = String(index + 1).padStart(2, '0');
    };
    carousel.classList.add('carousel-ready');
    carousel.querySelector('.carousel-controls').hidden = false;
    carousel.querySelector('.carousel-prev').addEventListener('click', () => showSlide(index - 1));
    carousel.querySelector('.carousel-next').addEventListener('click', () => showSlide(index + 1));
    carousel.addEventListener('keydown', event => {
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
      event.preventDefault();
      showSlide(index + (event.key === 'ArrowRight' ? 1 : -1));
    });
    viewport.addEventListener('pointerdown', event => {
      if (event.pointerType !== 'touch') return;
      touchStart = { x:event.clientX, y:event.clientY, pointerId:event.pointerId };
      viewport.setPointerCapture(event.pointerId);
    });
    viewport.addEventListener('pointerup', event => {
      if (!touchStart || touchStart.pointerId !== event.pointerId) return;
      const x = event.clientX - touchStart.x;
      const y = event.clientY - touchStart.y;
      touchStart = null;
      if (Math.abs(x) >= 40 && Math.abs(x) > Math.abs(y) * 1.3) showSlide(index + (x < 0 ? 1 : -1));
    });
    viewport.addEventListener('pointercancel', () => { touchStart = null; });
    showSlide(0);
  });

  // hover·포커스·탭에서 동일한 모션을 1회 실행합니다. 새 기구를 선택하면 이전 모션은 멈춥니다.
  const buttons = [...document.querySelectorAll('#fixed-equipment [data-equipment]')];
  let activeEquipment = null;
  let equipmentTimer = null;
  function stopEquipment(button = activeEquipment) {
    if (!button || button !== activeEquipment) return;
    window.clearTimeout(equipmentTimer);
    button.classList.remove('is-playing');
    activeEquipment = null;
  }
  function playEquipment(button) {
    stopEquipment();
    // 같은 기구를 다시 탭할 때도 처음부터 재생합니다.
    void button.offsetWidth;
    activeEquipment = button;
    button.classList.add('is-playing');
    equipmentTimer = window.setTimeout(() => stopEquipment(button), 1800);
  }
  buttons.forEach(button => {
    button.addEventListener('pointerenter', event => {
      if (event.pointerType !== 'touch') playEquipment(button);
    });
    button.addEventListener('pointerleave', event => {
      if (event.pointerType !== 'touch') stopEquipment(button);
    });
    button.addEventListener('focus', () => {
      if (button.matches(':focus-visible')) playEquipment(button);
    });
    button.addEventListener('blur', () => stopEquipment(button));
    button.addEventListener('click', () => playEquipment(button));
  });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stopEquipment();
  });

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const question = document.getElementById('question-transition');
  const relations = document.getElementById('relations');
  const people = [...document.querySelectorAll('.relation-person')];
  const words = [...document.querySelectorAll('.relation-words li')];
  const tracks = [question, relations].filter(Boolean);
  const nearby = new Set(tracks);
  let pending = false;

  function trackProgress(track) {
    const bounds = track.getBoundingClientRect();
    const scene = track.firstElementChild;
    const headerHeight = document.querySelector('.masthead').offsetHeight;
    const travel = bounds.height - scene.offsetHeight;
    return travel > 0 ? Math.max(0, Math.min(1, (headerHeight - bounds.top) / travel)) : 0;
  }
  function updateScenes() {
    pending = false;
    if (!document.body.classList.contains('editorial-motion')) return;
    if (question && nearby.has(question)) {
      const progress = trackProgress(question);
      // CSS에 opacity 값만 전달하며 기존 사진·키워드 요소를 제거하지 않습니다.
      question.style.setProperty('--echo-opacity', Math.max(0, 1 - progress * 1.8).toFixed(3));
    }
    if (relations && nearby.has(relations)) {
      const stage = Math.min(6, Math.floor(trackProgress(relations) * 7));
      if (relations.dataset.stage !== String(stage)) {
        relations.dataset.stage = String(stage);
        people.forEach((person, index) => person.classList.toggle('is-present', index <= stage));
        words.forEach((word, index) => word.classList.toggle('is-present', index < stage));
      }
    }
  }
  function queueScenes() {
    if (pending) return;
    pending = true;
    window.requestAnimationFrame(updateScenes);
  }
  function configureScenes() {
    const enabled = !reducedMotion.matches && 'IntersectionObserver' in window;
    document.body.classList.toggle('editorial-motion', enabled);
    queueScenes();
  }
  if ('IntersectionObserver' in window) {
    const sceneObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) nearby.add(entry.target);
        else nearby.delete(entry.target);
      });
      queueScenes();
    }, { rootMargin:'100px 0px' });
    tracks.forEach(track => sceneObserver.observe(track));
  }
  window.addEventListener('scroll', queueScenes, { passive:true });
  window.addEventListener('resize', queueScenes, { passive:true });
  if (reducedMotion.addEventListener) reducedMotion.addEventListener('change', configureScenes);
  configureScenes();
})();
