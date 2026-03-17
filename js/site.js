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


(function initScrollReveal(){
  const setup = () => {
    const groups = [
      {selector: '.hero .container, .hero-copy, .lead-hero-card, .trust-strip, .trust-point, .section-head, .sim-card, .step-card, .value-card, .stat-item', mode: 'alternate'},
      {selector: '.grid-cards .card', mode: 'alternate'},
      {selector: '.calculator-grid .card, .cards-grid .card, .results-grid .card', mode: 'alternate'},
      {selector: '.hero-card, .hero-panel, .hero-content', mode: 'up'}
    ];
    const nodes = [];
    groups.forEach(group => {
      document.querySelectorAll(group.selector).forEach((node, index) => {
        if (!node.classList.contains('reveal')) {
          node.classList.add('reveal');
          if (group.mode === 'alternate') {
            node.classList.add(index % 2 === 0 ? 'reveal-left' : 'reveal-right');
          } else {
            node.classList.add('reveal-up');
          }
        }
        nodes.push(node);
      });
    });
    const uniq = Array.from(new Set(nodes));
    if (!('IntersectionObserver' in window)) {
      uniq.forEach(node => node.classList.add('is-visible'));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, {threshold: 0.12, rootMargin: '0px 0px -8% 0px'});
    uniq.forEach(node => io.observe(node));
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', setup);
  else setup();
})();



/* ===== Tracking GA4: navegação, scroll, tempo, CTA e WhatsApp ===== */
(function(){
  const GA_ID = 'G-274GF5NGKM';
  window.dataLayer = window.dataLayer || [];
  function gtag(){ dataLayer.push(arguments); }
  window.gtag = window.gtag || gtag;

  if (!window.__rx_ga_booted__) {
    window.__rx_ga_booted__ = true;
    const s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(s);
    gtag('js', new Date());
    gtag('config', GA_ID);
  }

  function rxTrack(name, params){
    try { gtag('event', name, params || {}); } catch(e) {}
  }
  window.rxTrack = rxTrack;

  // tempo na página
  setTimeout(() => rxTrack('tempo_30s', {page_path: location.pathname}), 30000);
  setTimeout(() => rxTrack('tempo_60s', {page_path: location.pathname}), 60000);

  // scroll
  const marks = {25:false,50:false,75:false};
  window.addEventListener('scroll', function() {
    const altura = document.documentElement.scrollHeight - window.innerHeight;
    if (altura <= 0) return;
    const pct = (window.scrollY / altura) * 100;
    [25,50,75].forEach(v => {
      if (pct >= v && !marks[v]) {
        marks[v] = true;
        rxTrack('scroll_' + v, {page_path: location.pathname});
      }
    });
  }, {passive:true});

  // clique em links e botões
  document.addEventListener('click', function(e){
    const el = e.target.closest('a,button');
    if(!el) return;
    const txt = ((el.innerText || el.textContent || '').trim()).slice(0,120);
    const href = (el.getAttribute('href') || '').trim();

    if (href.includes('wa.me') || href.includes('whatsapp')) {
      rxTrack('click_whatsapp', {page_path: location.pathname, label: txt || href});
      return;
    }

    if (txt.match(/diagn[oó]stico/i)) {
      rxTrack('click_diagnostico', {page_path: location.pathname, label: txt});
    }

    if (txt.match(/simulador|simuladores/i)) {
      rxTrack('click_simulador_cta', {page_path: location.pathname, label: txt});
    }

    if (href && href.includes('calculadora-')) {
      rxTrack('click_calculadora', {page_path: location.pathname, href: href, label: txt});
      return;
    }

    if (href && href.includes('calculadoras/')) {
      rxTrack('click_calculadora', {page_path: location.pathname, href: href, label: txt});
      return;
    }
  }, true);

  // mudanças nos selects do diagnóstico guiado
  document.addEventListener('change', function(e){
    const el = e.target;
    if (el && ['tipoEmpresa','desafio','faturamentoDiag'].includes(el.id)) {
      window.__rx_diag_started__ = true;
      rxTrack('inicio_diagnostico', {page_path: location.pathname, field: el.id, value: el.value || ''});
    }
  }, true);
})();

