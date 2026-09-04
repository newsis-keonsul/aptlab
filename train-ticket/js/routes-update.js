document.addEventListener('DOMContentLoaded', function () {
  var heroHeader = document.querySelector('header');
  if (heroHeader) heroHeader.style.backgroundImage = "linear-gradient(90deg,rgba(8,17,34,.48),rgba(9,19,39,.38) 34%,rgba(9,19,39,.08) 69%),url('hero-station-mosaic.png')";
  var heroHeading = document.querySelector('.hero h1');
  if (heroHeading) heroHeading.innerHTML = '추석 열차 승차권 <em>7일부터</em><br><em>일반예매</em> 시작';
  var heroIntro = document.querySelector('.hero p');
  if (heroIntro) heroIntro.innerHTML = '예매 일정과 꼭 알아둬야 할 내용까지<br>놓치기 쉬운 명절 승차권 예매 핵심만 담았습니다.';
  var heroCredit = document.querySelector('.credit');
  if (heroCredit) heroCredit.innerHTML = 'NEWSIS · APTLAB 001<br>2026.09.05.';
  var overviewHeading = document.querySelector('#overview h2');
  if (overviewHeading) overviewHeading.innerHTML = '코레일, 추석 승차권 예매 시작';
  var overviewLead = document.querySelector('.overview-copy > p');
  if (overviewLead) overviewLead.innerHTML = '한국철도공사(코레일)는 지난 3일부터 추석 명절 승차권 예매를 시작했다.<br>오는 <strong style="color:#2159d6">23일부터 27일까지</strong> 닷새간 운행하는 열차가 대상이다.';

  var routesSection = document.getElementById('routes');
  if (routesSection) {
    routesSection.style.borderBottom = '0';
    routesSection.style.paddingBottom = '40px';
  }

  var checkSection = document.getElementById('check');
  if (checkSection) {
    checkSection.style.paddingTop = '42px';
    var checkKicker = checkSection.querySelector('.kicker');
    if (checkKicker) checkKicker.textContent = '02';
    var checkTitle = checkSection.querySelector('h2');
    [checkKicker, checkTitle].forEach(function (element, index) {
      if (!element) return;
      element.style.opacity = '0';
      element.style.transform = 'translateY(34px)';
      element.style.transition = 'opacity .7s ease ' + (index * 0.12) + 's, transform .7s cubic-bezier(.22,.7,.2,1) ' + (index * 0.12) + 's';
    });
    var revealCheckTitle = function () {
      [checkKicker, checkTitle].forEach(function (element) {
        if (!element) return;
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
      });
    };
    if ('IntersectionObserver' in window && checkKicker) {
      var checkObserver = new IntersectionObserver(function (entries, observer) {
        if (entries[0].isIntersecting) {
          revealCheckTitle();
          observer.unobserve(entries[0].target);
        }
      }, { threshold: 0.25 });
      checkObserver.observe(checkKicker);
    } else {
      revealCheckTitle();
    }

    var checkGrid = checkSection.querySelector('.grid');
    if (checkGrid && !checkSection.querySelector('.booking-checklist')) {
      var checklist = document.createElement('div');
      checklist.className = 'booking-checklist';
      checklist.style.cssText = 'display:grid;gap:10px;max-width:760px;margin:28px auto 0;padding:22px 24px;border-radius:18px;background:#edf3ff';
      var partGradients = [
        '#fffaf0',
        '#fff3dc',
        '#ffe9bd'
      ];
      [
        "코레일 '통합 회원' 전환 및 가입",
        '사전 체험 서비스 및 여행정보 등록',
        '결제 기간 확인'
      ].forEach(function (item, index) {
        var label = document.createElement('label');
        label.style.cssText = 'display:flex;align-items:center;gap:12px;color:#17233c;font-size:17px;font-weight:700;line-height:1.5;cursor:pointer';
        label.innerHTML = '<input type="checkbox" disabled aria-label="' + item + '" style="width:19px;height:19px;accent-color:#2159d6;cursor:pointer;opacity:1">' + item;
        checklist.appendChild(label);
      });
      checkGrid.insertAdjacentElement('beforebegin', checklist);
    }

    if (checkGrid && !checkGrid.querySelector('.check-part')) {
      var checklistBox = checkSection.querySelector('.booking-checklist');
      if (checklistBox) {
        checklistBox.style.position = 'sticky';
        checklistBox.style.top = '16px';
        checklistBox.style.zIndex = '4';
        checklistBox.style.boxShadow = '0 10px 26px rgba(23,61,128,.14)';
      }

      checkGrid.style.cssText = 'display:grid;grid-template-columns:1fr;gap:18px;max-width:760px;margin:34px auto 0';
      checkGrid.innerHTML = '';
      [
        {
          title: "코레일 '<strong style=\"color:#2159d6\">통합 회원</strong>' 전환 및 가입",
          body: '<p style="margin:28px 0 18px">코레일·에스알 통합 후 첫 명절 예매는 ‘통합 회원’ 전환 및 가입을 마쳐야 가능하다.</p><div style="display:grid;gap:18px"><div><div style="margin-bottom:8px;color:#2159d6;font-size:14px;font-weight:800">회원 전환</div><div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px"><div style="padding:14px;border-radius:14px;background:#fff;border:1px solid #d7e0eb"><b style="font-size:15px">기존 코레일 회원</b><span style="display:block;margin-top:5px;color:#2159d6;font-size:15px">→ 자동 전환</span></div><div style="padding:14px;border-radius:14px;background:#fff;border:1px solid #d7e0eb"><b style="font-size:15px">에스알만 가입한 회원</b><span style="display:block;margin-top:5px;color:#2159d6;font-size:15px">→ 별도 웹페이지에서 가입·전환</span></div></div><p style="margin:8px 0 0;font-size:14px;line-height:1.6">전환·가입 웹페이지는 모바일 앱 ‘코레일+’ 또는 코레일 홈페이지에서 확인할 수 있다.</p></div><div><div style="margin-bottom:8px;color:#2159d6;font-size:14px;font-weight:800">교통약자 인증</div><div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px"><div style="padding:14px;border-radius:14px;background:#fff;border:1px solid #d7e0eb"><b style="font-size:15px">경로 회원</b><span style="display:block;margin-top:5px;color:#2159d6;font-size:15px">→ 가입 시 자동 인증</span></div><div style="padding:14px;border-radius:14px;background:#fff;border:1px solid #d7e0eb"><b style="font-size:15px">그밖의 사전예매 대상자</b><span style="display:block;margin-top:5px;color:#2159d6;font-size:15px">→ 전용 웹페이지에서 인증</span></div></div><p style="margin:8px 0 0;font-size:14px;line-height:1.6">메인화면 하단의 ‘장애인/임산부/유공자 인증’에서 인증할 수 있다.</p></div></div>'
        },
        {
          title: '사전 체험 서비스 및 <strong style="color:#2159d6">여행정보</strong> 등록',
          body: '<p style="margin:28px 0 0">코레일은 지난달 24일부터 명절 전용 웹페이지에서 추석 예매 ‘사전 체험 서비스’를 제공하고 있다.</p><div style="margin:18px 0;padding:16px 18px;border-radius:14px;background:rgba(255,255,255,.72)"><b style="display:block;color:#2159d6;font-size:14px">사전 체험 서비스 기간</b><span style="display:block;margin-top:6px;font-size:16px">8월 24일 ~ 9월 2일<br>9월 5일 ~ 9월 6일</span></div><p style="margin:0">이번 주말 이틀간 서비스를 이용할 수 있다.</p><p style="margin:14px 0 0">사전 체험 서비스에서는 여행정보 등록이 가능하다.</p><p style="margin:10px 0 0;font-size:15px;line-height:1.7">△ 이용 구간 · △ 출발일 · △ 인원 등 여행 정보를 미리 등록하면 예매 당일 저장된 정보를 바로 불러와 예매할 수 있다.</p>'
        },
        {
          title: '<strong style="color:#2159d6">결제 기간</strong> 확인',
          body: '<p style="margin:28px 0 18px">추석 승차권 결제는 예매와 별도로 진행한다.</p><div style="overflow-x:auto"><table style="width:100%;min-width:580px;border-collapse:collapse;background:rgba(255,255,255,.7);font-size:14px;line-height:1.55"><thead><tr><th style="padding:11px 10px;border-bottom:1px solid #cdd8e5;text-align:left">구분</th><th style="padding:11px 10px;border-bottom:1px solid #cdd8e5;text-align:left">결제기간</th><th style="padding:11px 10px;border-bottom:1px solid #cdd8e5;text-align:left">방법</th></tr></thead><tbody><tr><th style="padding:12px 10px;border-bottom:1px solid #dce4ec;text-align:left;color:#2159d6">사전예매</th><td style="padding:12px 10px;border-bottom:1px solid #dce4ec">12일 0시 ~ 18일 0시</td><td style="padding:12px 10px;border-bottom:1px solid #dce4ec">고객센터 ARS(☏1588-7788)<br>또는 전국 역 창구</td></tr><tr><th style="padding:12px 10px;border-bottom:1px solid #dce4ec;text-align:left;color:#2159d6">일반예매</th><td style="padding:12px 10px;border-bottom:1px solid #dce4ec">12일 0시 ~ 15일 0시</td><td style="padding:12px 10px;border-bottom:1px solid #dce4ec">‘코레일+’ · 홈페이지</td></tr><tr><th style="padding:12px 10px;text-align:left;color:#2159d6">잔여석 예매</th><td style="padding:12px 10px">11일 오후 3시부터 상시</td><td style="padding:12px 10px">‘코레일+’ · 코레일 홈페이지<br>· 역 창구</td></tr></tbody></table></div><div style="margin-top:18px;padding-top:14px;border-top:1px solid #d5dde7;font-size:14px;line-height:1.7"><p style="margin:0">사전예매 승차권은 신분증(임산부는 산모수첩 등 임신·출산 증명서) 지참 시에만 발권할 수 있다.</p><p style="margin:8px 0 0">보호자가 예매 고객의 신분증을 지참할 경우 대리 결제 및 발권이 가능하다.</p><p style="margin:8px 0 0">결제하지 않을 경우 예매한 승차권은 자동 취소된다.</p></div>'
        }
      ].forEach(function (part, index) {
        var article = document.createElement('article');
        article.className = 'check-part';
        article.dataset.checkIndex = index;
        article.style.cssText = 'min-height:250px;padding:34px;border-radius:22px;background:' + partGradients[index] + ';box-shadow:0 10px 28px rgba(32,54,95,.09)';
        article.innerHTML = '<div style="color:#2159d6;font-size:13px;font-weight:800;letter-spacing:.1em">CHECK POINT</div><h3 style="margin:20px 0 12px;font-size:28px;letter-spacing:-.06em">' + part.title + '</h3><div style="font-size:17px;line-height:1.75">' + part.body + '</div>';
        if (index === 0) {
          article.querySelectorAll('div').forEach(function (label) {
            if (label.textContent === '회원 전환' || label.textContent === '교통약자 인증') {
              var bar = document.createElement('span');
              bar.style.cssText = 'display:inline-block;flex:0 0 20px;width:20px;height:1px;margin-right:8px;background:#2159d6;transform:translateY(-1px)';
              label.style.display = 'flex';
              label.style.alignItems = 'center';
              label.prepend(bar);
            }
          });
          article.querySelectorAll('b').forEach(function (label) {
            if (label.textContent === '그밖의 사전예매 대상자') {
              label.innerHTML = '그밖의 사전예매 대상자 <small style="font-size:12px;font-weight:400">(장애인, 임산부, 유공자)</small>';
            }
          });
          article.querySelectorAll('span').forEach(function (label) {
            if (label.textContent === '→ 전용 웹페이지에서 인증') {
              label.textContent = '→ 명절 예매 전용 웹페이지';
            }
          });
          article.querySelectorAll('p').forEach(function (paragraph) {
            if (paragraph.textContent.indexOf('메인화면 하단') !== -1) {
              paragraph.textContent = '명절 예매 전용 웹페이지 메인 화면 하단의 ‘장애인/임산부/유공자 인증’에서 인증할 수 있다.';
            }
          });
        }
        if (index === 1) {
          var serviceParagraphs = article.querySelectorAll('p');
          if (serviceParagraphs[0]) {
            serviceParagraphs[0].innerHTML = '코레일은 지난달 24일부터 명절 전용 웹페이지에서 추석 예매 <strong style="color:#2159d6">사전 체험 서비스</strong>를 제공한다.';
          }
          var periodBox = serviceParagraphs[0] && serviceParagraphs[0].nextElementSibling;
          if (periodBox) {
            periodBox.style.padding = '20px 22px';
            var periodTitle = periodBox.querySelector('b');
            var periodDates = periodBox.querySelector('span');
            if (periodTitle) periodTitle.style.fontSize = '16px';
            if (periodDates) {
              periodDates.style.fontSize = '19px';
              periodDates.innerHTML = '8월 24일(월) ~ 9월 2일(수)<br>9월 5일(토) ~ 9월 6일(일)';
            }
          }
          if (serviceParagraphs[1]) {
            serviceParagraphs[1].innerHTML = '<strong style="color:#2159d6">이번 주말 동안</strong> 서비스를 이용할 수 있다.';
          }
          if (serviceParagraphs[2]) {
            serviceParagraphs[2].innerHTML = '사전 체험 서비스에서는 이용 구간 · 출발일 · 인원 등 <strong style="color:#2159d6">여행 정보를 미리 등록</strong>할 수 있다.';
          }
          if (serviceParagraphs[3]) {
            serviceParagraphs[3].style.fontSize = '17px';
            serviceParagraphs[3].innerHTML = '등록한 경우 예매 당일 저장된 정보를 <strong style="color:#2159d6">바로 불러와 예매</strong>할 수 있다.';
          }
        }
        if (index === 2) {
          var paymentTable = article.querySelector('table');
          if (paymentTable) {
            paymentTable.style.fontSize = '16px';
            paymentTable.querySelectorAll('th, td').forEach(function (cell) {
              cell.style.padding = '14px 12px';
              if (cell.innerHTML.indexOf('‘코레일+’') !== -1) {
                cell.innerHTML = cell.innerHTML.replace(/‘코레일\+’/g, '코레일+');
              }
              if (cell.innerHTML.indexOf('· 역 창구') !== -1) {
                cell.innerHTML = cell.innerHTML.replace('· 역 창구', '· 전국 역 창구');
              }
              if (cell.textContent === '코레일+ · 홈페이지') {
                cell.textContent = '코레일+ · 코레일 홈페이지';
              }
              if (cell.textContent.indexOf('고객센터 ARS(☏1588-7788)') !== -1) {
                cell.innerHTML = '코레일+ · 코레일 홈페이지<br>고객센터 ARS(☏1588-7788) · 전국 역 창구';
              }
            });
          }
          var paymentParagraphs = article.querySelectorAll('p');
          var paymentIntro = paymentParagraphs[0];
          var autoCancelNotice;
          paymentParagraphs.forEach(function (paragraph) {
            if (paragraph.textContent.indexOf('결제하지 않을 경우') !== -1) autoCancelNotice = paragraph;
            if (paragraph.textContent.indexOf('신분증(임산부는') !== -1) {
              paragraph.innerHTML = '사전예매 승차권은 <strong style="color:#2159d6">신분증(임산부는 산모수첩 등 임신·출산 증명서) 지참</strong> 시에만 발권할 수 있다.';
            }
          });
          if (paymentIntro && autoCancelNotice) {
            paymentIntro.innerHTML = '추석 승차권 <strong style="color:#2159d6">결제</strong>는 예매와 <strong style="color:#2159d6">별도로 진행</strong>한다.';
            autoCancelNotice.innerHTML = '결제하지 않을 경우 예매한 승차권은 <strong style="color:#2159d6">자동 취소</strong>된다.';
            autoCancelNotice.remove();
            autoCancelNotice.style.margin = '8px 0 18px';
            paymentIntro.insertAdjacentElement('afterend', autoCancelNotice);
          }
        }
        checkGrid.appendChild(article);
      });

      if ('IntersectionObserver' in window && checklistBox) {
        var partObserver = new IntersectionObserver(function (entries) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            var inputs = checklistBox.querySelectorAll('input');
            var input = inputs[Number(entry.target.dataset.checkIndex)];
            if (input) input.checked = true;
            if (Array.prototype.every.call(inputs, function (checkbox) { return checkbox.checked; })) {
              inputs.forEach(function (checkbox) { checkbox.disabled = false; });
            }
          });
        }, { threshold: 0.55 });
        checkGrid.querySelectorAll('.check-part').forEach(function (part) {
          partObserver.observe(part);
        });
      }
    }
  }

  var integrationSection = document.getElementById('integration');
  if (integrationSection && !integrationSection.querySelector('.integration-photo')) {
    var integrationIntro = integrationSection.querySelector(':scope > p');
    var integrationBenefits = integrationSection.querySelector('.benefits');
    var oldIntegrationKicker = integrationSection.querySelector(':scope > .kicker');
    var oldIntegrationTitle = integrationSection.querySelector(':scope > h2');
    integrationSection.classList.remove('photo', 'integrated');
    integrationSection.style.paddingTop = '0';
    if (oldIntegrationKicker) oldIntegrationKicker.remove();
    if (oldIntegrationTitle) oldIntegrationTitle.remove();

    var integrationPhoto = document.createElement('div');
    integrationPhoto.className = 'integration-photo';
    integrationPhoto.style.cssText = "position:relative;height:500px;margin:0 -0px 42px;overflow:hidden;background:linear-gradient(90deg,rgba(6,13,27,.76),rgba(6,13,27,.35) 48%,transparent 74%),linear-gradient(0deg,rgba(6,13,27,.55),transparent 54%),url('integrated-trains.jpg') center/cover";
    integrationPhoto.innerHTML = '<div style="position:absolute;bottom:46px;left:0;color:#fff"><div style="margin-bottom:12px;color:#8eb1ff;font-size:14px;font-weight:800;letter-spacing:.11em">03</div><h2 style="margin:0;color:#fff;font-size:clamp(38px,5vw,66px)">코레일과 에스알 통합</h2></div>';
    integrationPhoto.firstElementChild.style.left = 'max(20px,calc((100% - 1180px)/2))';
    integrationSection.prepend(integrationPhoto);

    if (integrationIntro) {
      var integrationSubtitle = document.createElement('h3');
      integrationSubtitle.className = 'integration-subtitle';
      integrationSubtitle.textContent = '통합 후 무엇이 바뀌었나';
      integrationSubtitle.style.cssText = 'max-width:860px;margin:0 auto 12px;color:#17233c;font-size:28px;line-height:1.35;letter-spacing:-.06em;text-align:center';
      integrationIntro.insertAdjacentElement('beforebegin', integrationSubtitle);
      integrationIntro.innerHTML = '한국철도공사(코레일)가 지난 1일부터 <strong style="color:#2159d6">고속철도 통합 운영</strong>을 시작했다.';
      integrationIntro.style.cssText = 'max-width:860px;margin:0 auto;color:#17233c;text-align:center';
      var integrationDetail = document.createElement('p');
      integrationDetail.style.cssText = 'max-width:860px;margin:8px auto 0;color:#17233c;text-align:center';
      integrationDetail.innerHTML = '고속철도 차량을 KTX로 통합 운용하고, SRT는 <strong style="color:#2159d6">KTX-산천</strong>으로 이름을 변경했다.';
      integrationIntro.insertAdjacentElement('afterend', integrationDetail);
    }
    if (integrationBenefits) {
      integrationBenefits.style.marginTop = '34px';
      integrationBenefits.style.position = 'relative';
      integrationBenefits.style.gap = '14px';
      integrationBenefits.style.gridTemplateColumns = 'repeat(2,minmax(0,1fr))';
      var benefitDetails = [
        {
          title: '좌석 수 증가',
          body: 'KTX 좌석을 하루 평균 <strong style="color:#2159d6">1만 6천석</strong>, 일주일 기준 <strong style="color:#2159d6">11만 6천석</strong> 늘렸다.'
        },
        {
          title: '운행 횟수 증가',
          body: '서울역 이용객을 위해 경부·경전·동해·호남·전라선은 주중 <strong style="color:#2159d6">13회</strong>, 주말 <strong style="color:#2159d6">14회</strong> 증편한다.<br><span style="font-size:14px">중앙선 KTX-이음(서울~부전)도 매일 2회 늘어난다.</span>'
        },
        {
          title: '운임 인하',
          body: 'KTX 운임은 SRT 운임 기준에 맞춰 평균 <strong style="color:#2159d6">10% 저렴한 수준</strong>으로 낮아진다.<br><span style="display:block;margin-top:7px;font-size:14px">서울~부산 59,800원 → 54,400원(-5,400원)<br>용산~광주송정 46,800원 → 42,000원(-4,800원)</span>'
        },
        {
          title: '혜택 확대',
          body: '수서 출발 열차 이용객도 <strong style="color:#2159d6">마일리지·환승할인</strong> 등 KTX 이용 혜택을 누릴 수 있다.'
        }
      ];
      var benefitCards = integrationBenefits.querySelectorAll('.benefit');
      if (benefitCards.length) {
        benefitCards.forEach(function (card, index) {
          var detail = benefitDetails[index];
          card.style.cssText += ';position:relative;z-index:1;min-height:230px;padding:28px;text-align:left;border:1px solid #d4dbe5;border-radius:5px;background:#fff;box-shadow:4px 5px 0 #dce3ec;cursor:default';
          card.innerHTML = '<span style="position:absolute;top:-1px;right:-1px;width:0;height:0;border-top:28px solid #e8edf3;border-left:28px solid transparent"></span><h3 style="margin:0 0 18px;font-size:25px;letter-spacing:-.06em"><span style="font-size:25px;background:linear-gradient(transparent 58%,#ffe68a 58%);padding:0 2px">' + detail.title + '</span></h3><p style="margin:0;font-size:16px;line-height:1.75">' + detail.body + '</p>';
        });
      }
    }
  }

  document.querySelectorAll('.toc a[href="#station"]').forEach(function (link) { link.remove(); });
  var tocWrap = document.querySelector('.toc .wrap');
  if (tocWrap) tocWrap.style.gridTemplateColumns = 'repeat(3,1fr)';
  var stationSection = document.getElementById('station');
  if (stationSection) stationSection.remove();

  var stationSection = document.getElementById('station');
  if (stationSection && !stationSection.querySelector('.station-photo-title')) {
    var stationKicker = stationSection.querySelector(':scope > .kicker');
    var stationHeading = stationSection.querySelector(':scope > h2');
    var stationPhoto = stationSection.querySelector('.priority');
    if (stationKicker) stationKicker.remove();
    if (stationHeading) stationHeading.remove();
    if (stationPhoto) {
      var stationCaption = stationPhoto.querySelector('span');
      if (stationCaption) stationCaption.remove();
      stationSection.style.paddingTop = '0';
      stationSection.style.paddingBottom = '0';
      stationPhoto.style.cssText = "position:relative;height:500px;margin:0;overflow:hidden;border-radius:0;background:linear-gradient(90deg,rgba(6,13,27,.76),rgba(6,13,27,.32) 48%,transparent 74%),linear-gradient(0deg,rgba(6,13,27,.55),transparent 54%),url('priority-lane.jpg') center/cover";
      var stationTitle = document.createElement('div');
      stationTitle.className = 'station-photo-title';
      stationTitle.style.cssText = 'position:absolute;bottom:46px;left:0;color:#fff';
      stationTitle.innerHTML = '<div style="margin-bottom:12px;color:#8eb1ff;font-size:14px;font-weight:800;letter-spacing:.11em">04</div><h2 style="margin:0;color:#fff;font-size:clamp(38px,5vw,66px)">서울역 현장</h2>';
      stationPhoto.appendChild(stationTitle);
    }
  }

  var schedulePhoto = document.querySelector('.schedule-photo');
  var heading = document.querySelector('.schedule-photo .photo-heading');
  if (heading) {
    var inPhotoSubtitle = heading.querySelector('.route-subtitle');
    if (inPhotoSubtitle) inPhotoSubtitle.remove();
    heading.style.left = 'max(20px,calc((100% - 1180px)/2))';
    heading.style.right = 'auto';
    heading.style.transform = 'none';
    heading.style.width = 'auto';
    heading.style.textAlign = 'left';
    heading.style.top = 'auto';
    heading.style.bottom = '46px';
  }
  if (schedulePhoto && !document.querySelector('.route-subtitle-outside')) {
    var subtitle = document.createElement('p');
    subtitle.className = 'route-subtitle-outside';
    subtitle.innerHTML = '같은 노선, 다른 예매일<br>행선지에 따라 확인 필요';
    subtitle.style.cssText = 'width:min(1180px,calc(100% - 40px));margin:26px auto 20px;color:#17233c;font-size:27px;font-weight:800;line-height:1.42;letter-spacing:-.06em;text-align:center';
    schedulePhoto.insertAdjacentElement('afterend', subtitle);
  }

  document.querySelectorAll('.booking-schedule-table td').forEach(function (cell) {
    if (cell.textContent.indexOf('KTX·SRT') !== -1) {
      cell.innerHTML = 'KTX(구 SRT)<br><small>수서 출·도착</small>';
    }
  });

  var scheduleTable = document.querySelector('.routes .booking-schedule-table');
  var details = scheduleTable && scheduleTable.previousElementSibling;
  var phoneBooking = details && details.querySelector('p');
  var notice = document.querySelector('.routes .note');
  if (scheduleTable && phoneBooking && notice) {
    phoneBooking.remove();
    phoneBooking.style.cssText = 'width:min(1180px,calc(100% - 40px));margin:20px auto 0;color:#17233c;font-size:15px;line-height:1.8;text-align:center';
    scheduleTable.insertAdjacentElement('afterend', phoneBooking);
  }

  var phoneNotice = scheduleTable && scheduleTable.nextElementSibling;
  var generalBooking = details && details.querySelector('p');
  if (phoneNotice && generalBooking && notice) {
    phoneNotice.innerHTML = '지난 3일부터 이틀간 진행된 교통약자 대상 사전예매는<br><span style="color:#2159d6">철도고객센터(☏1455-8545)</span> 전화 예매도 가능했다.';
    phoneNotice.style.cssText = 'width:min(1180px,calc(100% - 40px));margin:22px auto 0;color:#17233c;font-size:18px;font-weight:400;line-height:1.8;text-align:center';
    generalBooking.innerHTML = '일반예매는 <span style="color:#2159d6">전용 웹페이지</span>에서만 할 수 있다.';
    generalBooking.style.cssText = 'width:min(1180px,calc(100% - 40px));margin:8px auto 0;color:#17233c;font-size:18px;font-weight:400;line-height:1.8;text-align:center';
    notice.insertAdjacentElement('afterend', phoneNotice);
    phoneNotice.insertAdjacentElement('afterend', generalBooking);
    if (!document.querySelector('.ticket-limit-note')) {
      var ticketLimit = document.createElement('p');
      ticketLimit.className = 'ticket-limit-note';
      ticketLimit.innerHTML = '예매할 수 있는 좌석 수는 <span style="color:#2159d6">1회당 6매</span> 이내로, <span style="color:#2159d6">1인당 최대 12매</span>까지다.';
      ticketLimit.style.cssText = 'width:min(1180px,calc(100% - 40px));margin:8px auto 0;color:#17233c;font-size:18px;font-weight:400;line-height:1.8;text-align:center';
      generalBooking.insertAdjacentElement('afterend', ticketLimit);
    }
  }

  if (details) {
    details.style.cssText = 'width:min(1180px,calc(100% - 40px));margin:0 auto 28px;color:#17233c;font-size:16px;line-height:1.8;text-align:center';
    details.innerHTML = '<p style="margin:0">ITX 등 <strong style="color:#2159d6">일반열차</strong>는 노선과 관계 없이 <strong style="color:#2159d6">7일</strong>에 예매해야 한다.</p><p style="margin:10px 0 0"><strong style="color:#2159d6">KTX</strong>는 노선에 따라 <strong style="color:#2159d6">8일부터 11일까지</strong>로 나눠서 예매가 이루어진다.</p><p style="margin:30px 0 0">경부선은 10일과 11일 예매 일정에 따라<br>각각 수서 출·도착과 서울 출·도착으로 나뉜다.</p><p style="margin:10px 0 0">예매에 혼선이 없게 사전 확인이 필요하다.</p>';
  }
});
