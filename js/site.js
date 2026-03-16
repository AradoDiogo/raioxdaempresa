(function(){
  const path = window.location.pathname.replace(/\/+$/, '') || '/';
  const file = path.split('/').pop() || 'index.html';
  const inFolder = /\/(calculadoras|entregaveis|simuladores)\//.test(path);
  const root = inFolder ? '../' : './';
  const isHome = path === '/' || file === 'index.html' || file === '';
  const isCalc = /\/calculadoras\//.test(path) || file === 'calculadoras.html' || file.startsWith('calculadora-');
  const isDiag = /diagnostico-financeiro\.html$/.test(path);
  const isVal = /valuation-empresarial\.html$/.test(path);
  const activeKey = isHome ? 'inicio' : isCalc ? 'calculadoras' : isDiag ? 'diagnostico' : isVal ? 'valuation' : '';

  const headerHtml = `
  <header class="rx-header" data-rx-header>
    <div class="rx-shell rx-header__inner">
      <a class="rx-brand" href="${root}index.html" aria-label="Raio-X da Empresa - página inicial">
        <span class="rx-brand__logo">RX</span>
        <span class="rx-brand__text">
          <strong>Raio-X da Empresa</strong>
          <small>Diagnóstico, simuladores e calculadoras</small>
        </span>
      </a>

      <button class="rx-menu-toggle" type="button" aria-expanded="false" aria-controls="rx-nav-panel" aria-label="Abrir menu">
        <span></span><span></span><span></span>
      </button>

      <div class="rx-nav-wrap" id="rx-nav-panel">
        <nav class="rx-nav" aria-label="Navegação principal">
          <a class="rx-nav__link ${activeKey === 'inicio' ? 'is-active' : ''}" href="${root}index.html">Início</a>
          <a class="rx-nav__link ${activeKey === 'diagnostico' ? 'is-active' : ''}" href="${root}entregaveis/diagnostico-financeiro.html">Diagnóstico</a>
          <a class="rx-nav__link" href="${root}index.html#simuladores">Simuladores</a>
          <a class="rx-nav__link ${activeKey === 'calculadoras' ? 'is-active' : ''}" href="${root}calculadoras/index.html">Calculadoras</a>
          <a class="rx-nav__link ${activeKey === 'valuation' ? 'is-active' : ''}" href="${root}entregaveis/valuation-empresarial.html">Valuation</a>
        </nav>
        <a class="rx-header__cta" href="https://wa.me/55011975434818?text=Ol%C3%A1%2C%20quero%20entender%20melhor%20como%20o%20Raio-X%20da%20Empresa%20pode%20ajudar%20na%20gest%C3%A3o%20financeira." target="_blank" rel="noopener noreferrer">Quero um diagnóstico</a>
      </div>
    </div>
  </header>`;

  const oldHeader = document.querySelector('header.site-header, header.rx-header');
  if (oldHeader) {
    oldHeader.outerHTML = headerHtml;
  } else if (document.body && !document.body.hasAttribute('data-no-global-header')) {
    document.body.insertAdjacentHTML('afterbegin', headerHtml);
  }

  const header = document.querySelector('[data-rx-header]');
  if (!header) return;
  const toggle = header.querySelector('.rx-menu-toggle');
  const navWrap = header.querySelector('.rx-nav-wrap');
  if (!toggle || !navWrap) return;

  function closeMenu(){
    header.classList.remove('is-open');
    toggle.setAttribute('aria-expanded','false');
    document.body.classList.remove('rx-menu-open');
  }
  function openMenu(){
    header.classList.add('is-open');
    toggle.setAttribute('aria-expanded','true');
    document.body.classList.add('rx-menu-open');
  }

  toggle.addEventListener('click', function(){
    header.classList.contains('is-open') ? closeMenu() : openMenu();
  });

  navWrap.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  window.addEventListener('resize', function(){ if (window.innerWidth > 980) closeMenu(); });
})();


(function removeLegacyCalculatorPills(){
  const cleanup = () => {
    document.querySelectorAll('.hero .pill-row, .hero .tag-row, .hero .chip-row, .hero [data-decorative-pills]').forEach(el => el.remove());
    const legacyTexts = ['Cálculo rápido', 'Leitura gerencial', 'SEO por intenção'];
    document.querySelectorAll('.hero .pill, .hero .tag, .hero .chip, .hero span, .hero a, .hero div').forEach(el => {
      const txt = (el.textContent || '').trim();
      if (legacyTexts.includes(txt)) {
        el.remove();
      }
    });
  };
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', cleanup);
  } else {
    cleanup();
  }
})();


(function improveLeadExperienceAndStatus(){
  const updateHomeCtas = () => {
    document.querySelectorAll('button, a').forEach(el => {
      const txt = (el.textContent || '').trim();
      if (!txt) return;
      if (/Falar com especialista|Receber diagnóstico financeiro|Receber diagnóstico|Quero aplicar isso|Quero estruturar isso|Quero cuidar do caixa|Quero acelerar isso|Quero avaliar meu negócio|Quero um diagnóstico gratuito|Quero que entrem em contato|Receber contato por e-mail|Solicitar contato por e-mail/i.test(txt)) {
        el.textContent = 'Quero um diagnóstico do meu negócio';
      }
    });
  };

  const statusToColor = (text='') => {
    const t = text.toLowerCase();
    if (/(saudável|saudavel|ok|seguro|interessante|controlado|confortável|confortavel)/.test(t)) return 'green';
    if (/(atenção|atencao|moderado|curta|alongado|alerta|ajuste)/.test(t)) return 'yellow';
    if (/(risco|estresse|crítico|critico|perigo|demorado|elevado|destrói|destroi)/.test(t)) return 'red';
    return '';
  };

  const paintKpiStatus = () => {
    document.querySelectorAll('.kpi').forEach(card => {
      const lbl = card.querySelector('.lbl')?.textContent?.trim().toLowerCase() || '';
      if (!lbl.includes('status')) return;
      const valNode = card.querySelector('.val');
      const color = statusToColor(valNode?.textContent || '');
      card.classList.add('is-status');
      card.classList.remove('status-green','status-yellow','status-red');
      if (color) card.classList.add(`status-${color}`);
    });
    document.querySelectorAll('.status').forEach(el => {
      const color = statusToColor(el.textContent || '');
      const wrap = el.closest('.card, .result-box, .status-card');
      if (wrap) {
        wrap.classList.remove('status-green','status-yellow','status-red');
        if (color) wrap.classList.add(`status-${color}`);
      }
      el.classList.remove('ok','warn','danger');
      if (color === 'green') el.classList.add('ok');
      if (color === 'yellow') el.classList.add('warn');
      if (color === 'red') el.classList.add('danger');
    });
  };

  const observe = () => {
    updateHomeCtas();
    paintKpiStatus();
    const obs = new MutationObserver(() => {
      updateHomeCtas();
      paintKpiStatus();
    });
    obs.observe(document.body, {subtree:true, childList:true, characterData:true});
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', observe);
  else observe();
})();
