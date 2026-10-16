'use strict';

// 하나의 비교창에서만 항목을 변경합니다. 사진 자리는 항목·좌우별 이름으로 구분하고 기존 기사 미디어와 분리합니다.
(() => {
  const section = document.getElementById('changes');
  if (!section) return;
  // 비교용 사진 10곳: 항목별 before/after의 src만 바꾸면 됩니다.
  // 비교 사진 10개 적용. 파일명과 확장자 대소문자를 유지하세요.
  // 디자인 왼쪽 사진은 compare-design-before.blur.jpg를 사용합니다.
  // 예: floor.before.src = 'image/compare-floor-before.JPG' (확장자 대소문자 유지)
  // label은 사진 위 라벨, caption은 사진 아래 설명, alt는 대체 텍스트, position은 사진 중심 위치입니다.
  const comparisons = {
    floor: {
      title:'바닥의 변화',
      description:'바닥의 재료와 표면을 비교해보세요.',
      before:{ src:'image/compare-floor-before.JPG', label:'모래바닥', caption:'', alt:'모래바닥 놀이터 사진', position:'center' },
      after:{ src:'image/compare-floor-after.JPG', label:'고무계열 바닥재', caption:'', alt:'고무계열 바닥재 놀이터 사진', position:'center' }
    },
    equipment: {
      title:'놀이기구의 변화',
      description:'기구의 배치와 놀이 기능이 연결되는 방식을 비교해보세요.',
      before:{ src:'image/compare-equipment-before.JPG', label:'개별 놀이기구', caption:'', alt:'따로 놓인 개별 놀이기구 사진', position:'center' },
      after:{ src:'image/compare-equipment-after.JPG', label:'조합놀이대', caption:'', alt:'여러 놀이기능을 결합한 조합놀이대 사진', position:'center' }
    },
    rest: {
      title:'머무는 공간의 변화',
      description:'그늘, 조경, 테이블의 구성을 비교해보세요.',
      before:{ src:'image/compare-rest-before.JPG', label:'벤치·평상', caption:'', alt:'벤치와 평상 등 기존 휴게공간 사진', position:'center' },
      after:{ src:'image/compare-rest-after.JPG', label:'그늘·조경·테이블을 갖춘 휴게공간', caption:'', alt:'그늘과 조경, 테이블을 갖춘 휴게공간 사진', position:'center' }
    },
    design: {
      title:'디자인의 변화',
      description:'놀이시설의 형태와 디자인을 비교해보세요.',
      before:{ src:'image/compare-design-before.blur.jpg', label:'표준형 디자인', caption:'', alt:'일반적인 형태와 색상의 놀이시설 사진', position:'center' },
      after:{ src:'image/compare-design-after.JPG', label:'디자인 특화', caption:'', alt:'디자인 특화가 적용된 놀이시설 사진', position:'center' }
    },
    space: {
      title:'놀이공간의 확장',
      description:'일반 야외 놀이터와 물놀이 공간을 비교해보세요.',
      before:{ src:'image/compare-space-before.JPG', label:'일반 야외 놀이터', caption:'', alt:'일반 야외 놀이터 사진', position:'center' },
      after:{ src:'image/compare-space-after.jpg', label:'물·실내 놀이공간', caption:'출처 한화 건설부문', alt:'물·실내 놀이공간의 변화 사례 사진', position:'center' }
    }
  };
  const buttons = [...section.querySelectorAll('[data-comparison]')];
  const panel = document.getElementById('change-panel');
  const stage = document.getElementById('compare-stage');
  const range = document.getElementById('compare-range');
  const status = document.getElementById('change-status');
  let selection = 'floor';
  let initialized = false;
  let request = 0;
  let drag = null;
  const updateBoundary = value => {
    const percentage = Math.max(0, Math.min(100, Math.round(Number(value))));
    range.value = percentage;
    stage.style.setProperty('--compare-position', `${percentage}%`);
    const item = comparisons[selection];
    range.setAttribute('aria-valuetext', `${item.before.label} ${percentage}%, ${item.after.label} ${100 - percentage}%`);
  };
  range.addEventListener('input', () => updateBoundary(range.value));

  // 같은 두 이미지 요소를 재사용합니다. 연속 클릭하면 마지막 선택 항목만 반영합니다.
  const prepareImage = src => new Promise(resolve => {
    const image = new Image();
    image.onload = () => resolve(true);
    image.onerror = () => resolve(false);
    image.src = src;
  });
  const choose = async key => {
    initialized = true;
    const item = comparisons[key];
    const serial = ++request;
    panel.setAttribute('aria-busy', 'true');
    buttons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.comparison === key)));
    const loaded = await Promise.all([prepareImage(item.before.src), prepareImage(item.after.src)]);
    if (serial !== request) return;
    if (loaded.some(result => !result)) {
      panel.removeAttribute('aria-busy');
      buttons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.comparison === selection)));
      status.textContent = '사진을 불러오지 못했습니다. 항목을 다시 선택해주세요.';
      return;
    }
    selection = key;
    document.getElementById('change-panel-title').textContent = item.title;
    document.getElementById('change-description').textContent = item.description;
    section.querySelector('.change-panel-index').textContent = `${String(buttons.findIndex(button => button.dataset.comparison === key) + 1).padStart(2,'0')} / 05`;
    ['before','after'].forEach(side => {
      const photo = document.getElementById(`compare-${side}-photo`);
      photo.src = item[side].src;
      photo.alt = item[side].alt;
      photo.style.setProperty('--photo-position', item[side].position);
      document.getElementById(`compare-${side}-label`).textContent = item[side].label;
      document.getElementById(`compare-${side}-caption`).textContent = item[side].caption;
    });
    const note = document.getElementById('change-context-note');
    note.textContent = item.note || '';
    note.hidden = !item.note;
    updateBoundary(50);
    panel.removeAttribute('aria-busy');
    status.textContent = `${item.title} 비교를 표시했습니다. ${item.before.label}에서 ${item.after.label}로. ${item.description}`;
  };
  buttons.forEach(button => button.addEventListener('click', () => choose(button.dataset.comparison)));
  section.classList.add('compare-ready');
  // 초기 화면도 같은 자료를 읽으므로 사진 교체는 comparisons의 src 한 곳에서 처리합니다.
  if ('IntersectionObserver' in window) {
    const comparisonObserver = new IntersectionObserver(entries => {
      if (!entries.some(entry => entry.isIntersecting)) return;
      comparisonObserver.disconnect();
      if (!initialized) choose('floor');
    }, { rootMargin:'300px 0px' });
    comparisonObserver.observe(section);
  } else {
    choose('floor');
  }

  // 사진 전체를 드래그할 수 있습니다. 모바일의 세로 스크롤과 핀치 확대는 유지합니다.
  const moveBoundary = clientX => updateBoundary((clientX - drag.bounds.left) / drag.bounds.width * 100);
  stage.addEventListener('pointerdown', event => {
    if (event.button !== 0 || !event.isPrimary) return;
    drag = { id:event.pointerId, bounds:stage.getBoundingClientRect(), startX:event.clientX, startY:event.clientY, touch:event.pointerType === 'touch', moved:false };
    stage.setPointerCapture(event.pointerId);
    if (!drag.touch) {
      range.focus({ preventScroll:true });
      moveBoundary(event.clientX);
    }
  });
  stage.addEventListener('pointermove', event => {
    if (!drag || event.pointerId !== drag.id) return;
    if (drag.touch && !drag.moved) {
      const x = Math.abs(event.clientX - drag.startX);
      const y = Math.abs(event.clientY - drag.startY);
      if (Math.max(x,y) < 6) return;
      if (y > x) { drag = null; return; }
      drag.moved = true;
    }
    moveBoundary(event.clientX);
  });
  stage.addEventListener('pointerup', event => {
    if (!drag || event.pointerId !== drag.id) return;
    if (!drag.touch || drag.moved) moveBoundary(event.clientX);
    drag = null;
  });
  stage.addEventListener('pointercancel', () => { drag = null; });
  stage.addEventListener('lostpointercapture', () => { drag = null; });
})();
