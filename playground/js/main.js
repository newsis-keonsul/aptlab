'use strict';

// 외부 라이브러리 없이 실행. JavaScript가 없거나 관찰 API가 없으면 전체 콘텐츠를 표시합니다.
(() => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const parentsTrack = document.querySelector('.parents-track');
  const parentsScene = document.querySelector('.parents-scene');
  let parentsInView = true;
  const updateParentsDissolve = () => {
    if (!parentsTrack || !parentsScene || !parentsInView || !document.body.classList.contains('motion')) return;
    const bounds = parentsTrack.getBoundingClientRect();
    const headerHeight = document.querySelector('.masthead').offsetHeight;
    const travel = bounds.height - parentsScene.offsetHeight;
    const progress = travel > 0 ? Math.max(0, Math.min(1, (headerHeight - bounds.top) / travel)) : 0;
    // 처음·마지막 장면은 잠시 유지하고, 가운데 구간에서 스크롤 양에 따라 부드럽게 디졸브합니다.
    const phase = Math.max(0, Math.min(1, (progress - .22) / .56));
    const blend = phase * phase * (3 - 2 * phase);
    parentsTrack.style.setProperty('--parents-blend', blend.toFixed(4));
  };
  const videos = [...document.querySelectorAll('video.photo-media')];
  // 모든 현장 영상은 소리 없이 재생합니다. 컨트롤 조작 뒤에도 음성이 나오지 않게 유지합니다.
  const muteVideo = video => {
    video.defaultMuted = true;
    if (!video.muted) video.muted = true;
    if (video.volume !== 0) video.volume = 0;
    video.playsInline = true;
  };
  videos.forEach(video => {
    muteVideo(video);
    video.addEventListener('volumechange', () => muteVideo(video));
  });
  // 시대별 탐색·최근 사례·엔딩을 포함해 동시에 재생되는 영상은 하나만 허용합니다.
  videos.forEach(video => video.addEventListener('play', () => {
    muteVideo(video);
    if (video.hidden || !video.getClientRects().length) { video.pause(); return; }
    videos.forEach(other => { if (other !== video && !other.paused) other.pause(); });
  }));
  const isVideoOnScreen = video => {
    const bounds = video.getBoundingClientRect();
    return bounds.bottom > 70 && bounds.top < window.innerHeight;
  };
  const progress = document.getElementById('reading-progress');
  let framePending = false;
  const updateProgress = () => {
    const distance = document.documentElement.scrollHeight - window.innerHeight;
    const fraction = distance > 0 ? Math.max(0, Math.min(1, window.scrollY / distance)) : 0;
    if (progress) progress.style.transform = `scaleX(${fraction})`;
    updateParentsDissolve();
    videos.forEach(video => {
      if (!video.paused && !isVideoOnScreen(video)) video.pause();
    });
    framePending = false;
  };
  const queueProgress = () => {
    if (!framePending) {
      framePending = true;
      window.requestAnimationFrame(updateProgress);
    }
  };
  window.addEventListener('scroll', queueProgress, { passive: true });
  window.addEventListener('resize', queueProgress, { passive: true });
  updateProgress();

  let revealObserver;
  let stepObserver;
  function configureMotion() {
    revealObserver?.disconnect();
    stepObserver?.disconnect();
    const enabled = !reducedMotion.matches && 'IntersectionObserver' in window;
    document.body.classList.toggle('motion', enabled);
    if (!enabled) return;

    revealObserver = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      }
    }, { threshold: 0.08 });
    document.querySelectorAll('.reveal').forEach(element => revealObserver.observe(element));

    // 스크롤 단계가 화면 아래쪽의 읽기 영역에 도달할 때 sticky 그래픽 상태를 변경합니다.
    // 위로 되돌아갈 때도 해당 단계로 돌아옵니다. CSS가 상태별 도형 이동을 담당합니다.
    document.querySelectorAll('.scrolly').forEach(scrolly => {
      const section = scrolly.closest('section');
      const steps = [...scrolly.querySelectorAll('.scroll-step')];
      const initial = steps.findLast ? steps.findLast(step => step.getBoundingClientRect().top < window.innerHeight * .82) : [...steps].reverse().find(step => step.getBoundingClientRect().top < window.innerHeight * .82);
      section.dataset.stage = initial ? initial.dataset.stage : '0';
    });
    stepObserver = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const section = entry.target.closest('section');
        section.dataset.stage = entry.target.dataset.stage;
        section.querySelectorAll('.scroll-step').forEach(step => step.classList.toggle('is-active', step === entry.target));
      }
    }, { rootMargin: '-62% 0px -15% 0px', threshold: 0 });
    document.querySelectorAll('.scroll-step').forEach(step => stepObserver.observe(step));
  }
  configureMotion();
  queueProgress();
  if (parentsTrack && 'IntersectionObserver' in window) {
    const parentsObserver = new IntersectionObserver(entries => {
      parentsInView = entries[0].isIntersecting;
      if (parentsInView) queueProgress();
    }, { rootMargin: '120px 0px' });
    parentsObserver.observe(parentsTrack);
  }
  if (reducedMotion.addEventListener) reducedMotion.addEventListener('change', configureMotion);

  // 현장 영상은 보이는 동안만 재생합니다. 제어 버튼으로 직접 정지할 수 있습니다.
  // 자동재생은 화면 안의 영상에만 적용해 숨긴 원본의 불필요한 로딩을 막습니다.
  if (videos.length && 'IntersectionObserver' in window) {
    const visibleVideos = new Set();
    const syncVideo = video => {
        const shouldPlay = visibleVideos.has(video) && !video.hidden && video.getClientRects().length > 0 && isVideoOnScreen(video) && !document.hidden;
        video.autoplay = shouldPlay;
        muteVideo(video);
        if (shouldPlay) {
          video.play().then(() => {
            // 재생 준비 중 화면 밖으로 이동했을 때 늦게 재생되는 경우도 정지합니다.
            if (!visibleVideos.has(video) || video.hidden || !video.getClientRects().length || !isVideoOnScreen(video) || document.hidden) video.pause();
          }).catch(() => {});
        } else {
          video.pause();
        }
    };
    const syncVideos = () => videos.forEach(syncVideo);
    const videoObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting && entry.intersectionRatio >= .18) visibleVideos.add(entry.target);
        else visibleVideos.delete(entry.target);
        syncVideo(entry.target);
      });
    }, { threshold: [0, .18] });
    videos.forEach(video => videoObserver.observe(video));
    document.addEventListener('visibilitychange', syncVideos);
    window.addEventListener('pageshow', syncVideos);
  }

  // Web Share API → URL 복사 → 직접 선택 가능한 링크. 개인 결과 이미지를 생성하지 않습니다.
  const shareButton = document.getElementById('share-button');
  const shareStatus = document.getElementById('share-status');
  shareButton?.addEventListener('click', async () => {
    const url = document.querySelector('link[rel="canonical"]').href;
    const shareData = { title: document.querySelector('meta[property="og:title"]').content, text: document.querySelector('meta[property="og:description"]').content, url };
    shareStatus.textContent = '';
    if (navigator.share) {
      try {
        await navigator.share(shareData);
        shareStatus.textContent = '공유했습니다.';
        return;
      } catch (error) {
        if (error.name === 'AbortError') return;
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      shareStatus.textContent = '이야기 주소를 복사했습니다.';
    } catch {
      shareStatus.textContent = '주소를 선택해 복사하세요: ';
      const link = document.createElement('a');
      link.href = url;
      link.textContent = url;
      shareStatus.append(link);
    }
  });
})();
