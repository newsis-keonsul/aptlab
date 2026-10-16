'use strict';

// 엔딩 문장만 제어합니다. 영상 재생 및 다른 섹션의 관찰 코드는 변경하지 않습니다.
(() => {
  const scene = document.getElementById('timeline-video');
  if (!scene) return;
  const reducedMotion = matchMedia('(prefers-reduced-motion:reduce)');
  let observer;
  const configure = () => {
    observer?.disconnect();
    scene.classList.remove('ending-caption-motion','ending-entered');
    if (reducedMotion.matches || !('IntersectionObserver' in window)) return;
    scene.classList.add('ending-caption-motion');
    observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting && entry.intersectionRatio >= .35) scene.classList.add('ending-entered');
        else if (!entry.isIntersecting) scene.classList.remove('ending-entered');
      });
    }, { threshold:[0,.35] });
    observer.observe(scene);
  };
  if (reducedMotion.addEventListener) reducedMotion.addEventListener('change',configure);
  configure();
})();
