'use strict';

(() => {
  const root = document.getElementById('trend-timeline');
  if (!root) return;
  // 기존 사진·영상 요소에서 실제 경로와 대체 텍스트를 읽습니다. 원본 요소는 유지합니다.
  const media = (selector, label, credit = '') => {
    const element = document.querySelector(selector);
    return element ? { src:element.getAttribute('src'), type:element.tagName === 'VIDEO' ? 'video' : 'image', alt:element.getAttribute('alt') || element.getAttribute('aria-label'), label, credit } : null;
  };
  // 수정 위치: 네 시대의 대표 문구·설명·사례 선택 순서.
  const eras = {
    eighties: {
      title:'모래와 개별 놀이기구',
      description:'모래바닥 위에 그네, 시소, 구름사다리, 회전놀이기구 등이 각각 놓인 형태가 일반적이었다.',
      media:[media('#eighties-intro-video video','1980년대 놀이터 모습','출처: KTV'),media('#eighties .archive-grid figure:nth-child(2) img','월계시영고층아파트 · 현재 모습'),media('#eighties .archive-grid figure:nth-child(1) img','월계동신아파트 · 현재 모습')]
    },
    combination: {
      title:'조합놀이대가 중심으로',
      description:'개별 놀이기구와 함께 여러 놀이기능을 하나로 묶은 조합놀이대가 등장했다. 2000년대로 들어서면서 조합놀이대 중심의 구성이 뚜렷해지고, 고무계열 바닥재를 적용한 사례도 늘었다.',
      media:[media('#combination .comparison-grid figure:nth-child(2) img','한진한화그랑빌'),media('#combination .comparison-grid figure:nth-child(1) img','공릉아파트')]
    },
    specialization: {
      title:'놀이터 특화가 뚜렷해졌다',
      description:'테마와 디자인을 강조하거나 물놀이 공간을 도입하는 등 놀이터를 차별화하는 사례가 두드러졌다.',
      media:[media('#banpo-carousel .carousel-slide:nth-child(2) img','반포자이 · 테마형 놀이터'),media('#banpo-carousel .carousel-slide:nth-child(1) img','반포자이 · 물놀이터','출처 GS건설')]
    },
    recent: {
      title:'놀이공간은 더 다양해졌다',
      description:'최근 일부 신축 단지에서는 물놀이터와 실내놀이터, 유아놀이터를 마련하고 조경·휴게공간과 연계하거나 디자이너·예술가와 협업하는 사례도 나타나고 있다.',
      media:[media('#triniwon-video video','반포 트리니원'),media('#bangbae-video video','디에이치 방배'),media('.landscape-photos > .wide-photo img','장위자이레디언트')]
    }
  };
  Object.values(eras).forEach(era => { era.media = era.media.filter(Boolean); });
  const panel = document.getElementById('trend-panel');
  const frame = root.querySelector('.trend-frame');
  const photo = document.getElementById('trend-image');
  const video = document.getElementById('trend-video');
  const status = document.getElementById('trend-status');
  const buttons = [...root.querySelectorAll('[data-era]')];
  const options = root.querySelector('.trend-case-options');
  const reducedMotion = matchMedia('(prefers-reduced-motion:reduce)');
  let eraKey = 'eighties';
  let caseIndex = 0;
  let request = 0;

  const select = async (key, index = 0) => {
    const era = eras[key];
    if (!era.media.length) return;
    const nextIndex = (index + era.media.length) % era.media.length;
    const item = era.media[nextIndex];
    const serial = ++request;
    video.pause();
    panel.setAttribute('aria-busy','true');
    if (item.type === 'image') {
      const loaded = await new Promise(resolve => {
        const candidate = new Image();
        candidate.onload = () => resolve(true);
        candidate.onerror = () => resolve(false);
        candidate.src = item.src;
      });
      if (serial !== request) return;
      if (!loaded) { panel.removeAttribute('aria-busy'); status.textContent = '사진을 불러오지 못했습니다. 다른 사례를 선택해주세요.'; return; }
    }
    if (serial !== request) return;
    eraKey = key;
    caseIndex = nextIndex;
    frame.classList.toggle('trend-frame-archive', key === 'eighties' && item.type === 'video');
    photo.hidden = item.type !== 'image';
    video.hidden = item.type !== 'video';
    video.onloadedmetadata = null;
    if (item.type === 'image') {
      photo.src = item.src;
      photo.alt = item.alt;
      video.removeAttribute('src');
      video.load();
    } else {
      video.setAttribute('aria-label', item.alt);
      video.onloadedmetadata = () => {
        if (serial !== request || video.hidden || reducedMotion.matches || document.hidden) return;
        const bounds = video.getBoundingClientRect();
        const visible = Math.min(bounds.bottom, innerHeight) - Math.max(bounds.top,70);
        if (visible > bounds.height * .18) video.play().catch(() => {});
      };
      video.src = item.src;
      video.load();
    }
    document.getElementById('trend-panel-title').textContent = era.title;
    document.getElementById('trend-description').textContent = era.description;
    document.getElementById('trend-caption').textContent = item.label;
    document.getElementById('trend-credit').textContent = item.credit;
    buttons.forEach(button => button.setAttribute('aria-pressed',String(button.dataset.era === key)));
    options.replaceChildren();
    era.media.forEach((entry, position) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = entry.label;
      button.setAttribute('aria-pressed',String(position === nextIndex));
      button.setAttribute('aria-controls','trend-panel');
      button.addEventListener('click',() => select(key, position));
      options.append(button);
    });
    root.querySelector('.trend-counter').textContent = `${String(nextIndex + 1).padStart(2,'0')} / ${String(era.media.length).padStart(2,'0')}`;
    panel.removeAttribute('aria-busy');
    status.textContent = `${era.title}. ${item.label}. ${nextIndex + 1} / ${era.media.length}`;
  };
  buttons.forEach(button => {
    button.disabled = false;
    button.addEventListener('click',() => select(button.dataset.era));
  });
  root.querySelector('.trend-prev').addEventListener('click',() => select(eraKey,caseIndex - 1));
  root.querySelector('.trend-next').addEventListener('click',() => select(eraKey,caseIndex + 1));
  root.querySelector('.trend-media-controls').hidden = false;
  select('eighties');

  // 2020s 본문의 기존 두 영상을 삭제하지 않고 수동으로 하나씩 표시합니다.
  const gallery = document.querySelector('.recent-gallery');
  if (!gallery) return;
  const scenes = [...gallery.querySelectorAll('.landscape-video-scene')];
  let recentIndex = 0;
  const showRecent = index => {
    recentIndex = (index + scenes.length) % scenes.length;
    scenes.forEach((scene, position) => {
      scene.querySelector('video').pause();
      scene.hidden = position !== recentIndex;
      if (!scene.hidden) scene.classList.add('is-visible');
    });
    const label = scenes[recentIndex].querySelector('figcaption').textContent;
    gallery.querySelector('.recent-counter').textContent = `${label} · ${String(recentIndex + 1).padStart(2,'0')} / ${String(scenes.length).padStart(2,'0')}`;
  };
  gallery.querySelector('.recent-prev').addEventListener('click',() => showRecent(recentIndex - 1));
  gallery.querySelector('.recent-next').addEventListener('click',() => showRecent(recentIndex + 1));
  gallery.addEventListener('keydown',event => {
    if (event.target.closest('video') || !['ArrowLeft','ArrowRight'].includes(event.key)) return;
    event.preventDefault();
    showRecent(recentIndex + (event.key === 'ArrowRight' ? 1 : -1));
  });
  gallery.querySelector('.recent-gallery-controls').hidden = false;
  // 기존 영상 앵커로 방문해도 해당 영상을 선택해 표시합니다.
  const followHash = () => {
    if (location.hash === '#bangbae-video') showRecent(1);
    else if (location.hash === '#triniwon-video') showRecent(0);
  };
  followHash();
  addEventListener('hashchange',followHash);
})();
