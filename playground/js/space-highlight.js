'use strict';

// A 조감도 안의 공통 사진 카드 하나에서 B·C·D 원본을 보여줍니다. 페이지 높이는 바꾸지 않습니다.
(() => {
  const section = document.getElementById('changeable-space');
  if (!section) return;
  const stage = section.querySelector('#space-photo-stage');
  const area = section.querySelector('#space-focus-area');
  const detail = section.querySelector('#space-detail');
  const photo = section.querySelector('#space-photo');
  const title = section.querySelector('#space-detail-title');
  const note = section.querySelector('#space-photo-note');
  const status = section.querySelector('#space-photo-status');
  const buttons = [...section.querySelectorAll('[data-space-photo]')];

  // 파일 교체 위치: A는 index.html의 #space-plan, B·C·D는 아래 src입니다.
  // spot = [중심 x, 중심 y, 가로 반경, 세로 반경, 기울기]. A 전체를 기준으로 한 0~1000 좌표입니다.
  // 클릭 영역·라벨 위치는 index.html의 --spot-x/--spot-y/--hit-width/--hit-height에서 함께 조정합니다.
  const scenes = {
    B: { src:'image/B.jpg', width:3072, height:2045, title:'언덕과 터널',
      alt:'잔디 언덕을 오르내리고 언덕 속 터널을 통과하는 아이들',
      note:'오르고, 숨고, 통과하고. 놀이 방식은 아이가 정한다.',
      // 중앙 모래밭 아래, 터널 입구가 있는 낮은 녹지 언덕.
      spot:[500,625,85,45,0] },
    C: { src:'image/C.jpg', width:4096, height:2726, title:'모래놀이',
      alt:'열린 모래 영역에서 모래를 만지고 도구로 놀이하는 아이들',
      note:'파고, 쌓고, 허물며 매번 다른 놀이가 된다.',
      // 중앙 타원형 놀이영역 안쪽. 앞쪽 데크·넓은 길은 제외합니다.
      spot:[540,525,125,55,0] },
    D: { src:'image/D.jpg', width:4160, height:3120, title:'경사면과 지형놀이',
      alt:'잔디 경사면에 펼친 넓은 흰색 면 위로 미끄러져 내려오는 아이',
      note:'언덕과 경사면도 아이에게는 하나의 놀이 공간이 된다.',
      // 중앙 놀이영역 뒤의 넓은 잔디 비탈. 왼쪽 수로는 제외합니다.
      spot:[475,385,140,80,0] }
  };
  let selected = null;
  let hovered = null;
  let focused = null;
  let requestId = 0;

  function highlight(key) {
    stage.classList.toggle('has-spotlight', Boolean(key));
    if (!key) return;
    const [x,y,rx,ry,angle] = scenes[key].spot;
    area.setAttribute('cx', x);
    area.setAttribute('cy', y);
    area.setAttribute('rx', rx);
    area.setAttribute('ry', ry);
    area.setAttribute('transform', 'rotate(' + angle + ' ' + x + ' ' + y + ')');
  }
  function restoreHighlight() { highlight(selected || hovered || focused); }

  // 조감도의 네 모서리 중 라벨을 가장 덜 가리는 곳을 선택하고, 카드 전체를 이미지 안에 둡니다.
  function placeCard() {
    if (detail.hidden) return;
    const width = stage.clientWidth;
    const height = stage.clientHeight;
    if (!width || !height) return;
    const margin = 8;
    const mobile = window.matchMedia('(max-width:700px)').matches;
    const captionHeight = detail.querySelector('figcaption').offsetHeight;
    const availableHeight = Math.min(height - margin * 2, mobile ? height * .85 : height);
    const photoHeight = Math.max(1, Math.min((detail.clientWidth / (photo.width / photo.height)), availableHeight - captionHeight - 2));
    detail.style.setProperty('--card-photo-height', photoHeight + 'px');
    const cardWidth = detail.offsetWidth;
    const cardHeight = detail.offsetHeight;
    const right = Math.max(margin, width - cardWidth - margin);
    const bottom = Math.max(margin, height - cardHeight - margin);
    const bounds = stage.getBoundingClientRect();
    buttons.forEach(button => {
      button.style.removeProperty('--label-shift-x');
      button.style.removeProperty('--label-shift-y');
    });
    const labels = buttons.map(button => ({ key:button.dataset.spacePhoto, bounds:button.querySelector('span').getBoundingClientRect() }));
    const candidates = [{x:right,y:margin},{x:margin,y:margin},{x:right,y:bottom},{x:margin,y:bottom}];
    const overlap = (position,label) => {
      const left = label.bounds.left - bounds.left;
      const top = label.bounds.top - bounds.top;
      return Math.max(0, Math.min(position.x + cardWidth,left + label.bounds.width) - Math.max(position.x,left)) *
        Math.max(0, Math.min(position.y + cardHeight,top + label.bounds.height) - Math.max(position.y,top));
    };
    let best = candidates[0];
    let bestScore = Infinity;
    candidates.forEach((position,index) => {
      const score = labels.reduce((sum,label) => sum + overlap(position,label) * (label.key === selected ? 5 : 1),0) + index;
      if (score < bestScore) { best = position; bestScore = score; }
    });
    detail.style.setProperty('--card-x', best.x + 'px');
    detail.style.setProperty('--card-y', best.y + 'px');
    if (mobile) {
      const leftSpace = best.x - margin;
      const rightSpace = width - (best.x + cardWidth) - margin;
      const labelX = leftSpace >= rightSpace ? margin + leftSpace / 2 : best.x + cardWidth + rightSpace / 2;
      labels.forEach((label,index) => {
        const centerX = label.bounds.left - bounds.left + label.bounds.width / 2;
        const centerY = label.bounds.top - bounds.top + label.bounds.height / 2;
        buttons[index].style.setProperty('--label-shift-x',(labelX - centerX) + 'px');
        buttons[index].style.setProperty('--label-shift-y',(height * (index + .5) / labels.length - centerY) + 'px');
      });
    }
  }

  function closeCard() {
    const previous = buttons.find(button => button.dataset.spacePhoto === selected);
    const focusWasInside = detail.contains(document.activeElement);
    ++requestId;
    selected = hovered = focused = null;
    detail.hidden = true;
    stage.classList.remove('has-photo-card');
    buttons.forEach(button => {
      button.style.removeProperty('--label-shift-x');
      button.style.removeProperty('--label-shift-y');
    });
    detail.setAttribute('aria-busy','false');
    buttons.forEach(button => button.setAttribute('aria-pressed','false'));
    highlight(null);
    status.textContent = '사진 카드를 닫았습니다.';
    if (focusWasInside && previous) previous.focus({preventScroll:true});
  }

  async function showPhoto(key) {
    const scene = scenes[key];
    const thisRequest = ++requestId;
    selected = key;
    buttons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.spacePhoto === key)));
    highlight(key);
    detail.setAttribute('aria-busy', 'true');
    // 새 사진 로딩 중에는 이전 사진을 유지합니다. 빠르게 누르면 마지막 선택만 표시합니다.
    const nextImage = new Image();
    try {
      await new Promise((resolve,reject) => {
        nextImage.onload = resolve;
        nextImage.onerror = reject;
        nextImage.src = scene.src;
      });
    } catch {
      if (thisRequest !== requestId) return;
      detail.setAttribute('aria-busy', 'false');
      status.textContent = '사진을 불러오지 못했습니다. 공간을 다시 눌러주세요.';
      return;
    }
    if (thisRequest !== requestId) return;
    detail.classList.remove('is-revealing');
    photo.src = scene.src;
    photo.alt = scene.alt;
    photo.width = scene.width;
    photo.height = scene.height;
    title.textContent = scene.title;
    note.textContent = scene.note;
    detail.hidden = false;
    stage.classList.add('has-photo-card');
    detail.setAttribute('aria-busy', 'false');
    placeCard();
    void detail.offsetWidth;
    detail.classList.add('is-revealing');
    status.textContent = scene.title + ' 사진을 표시했습니다. ' + scene.note;
  }

  buttons.forEach(button => {
    const key = button.dataset.spacePhoto;
    button.addEventListener('pointerenter', event => {
      if (event.pointerType === 'touch') return;
      hovered = key;
      restoreHighlight();
    });
    button.addEventListener('pointerleave', event => {
      if (event.pointerType === 'touch') return;
      if (hovered === key) hovered = null;
      restoreHighlight();
    });
    button.addEventListener('focus', () => {
      if (!button.matches(':focus-visible')) return;
      focused = key;
      restoreHighlight();
    });
    button.addEventListener('blur', () => {
      if (focused === key) focused = null;
      restoreHighlight();
    });
    button.addEventListener('click', () => showPhoto(key));
  });
  section.querySelector('.space-card-close').addEventListener('click',closeCard);
  section.addEventListener('keydown',event => {
    if (event.key === 'Escape' && !detail.hidden) { event.preventDefault(); closeCard(); }
  });
  if ('ResizeObserver' in window) new ResizeObserver(placeCard).observe(stage);
  else window.addEventListener('resize',placeCard,{passive:true});
  section.querySelector('#space-plan').addEventListener('load',placeCard);
  section.querySelector('.space-hotspots').hidden = false;
})();
