/* Mattos Infra & Tecnologia — seletor Sistema / Escuro / Claro.
   Sem bibliotecas; preferência salva somente no navegador. */
(() => {
  'use strict';
  const KEY = 'mattos-infra-preferencia-tema';
  const media = window.matchMedia('(prefers-color-scheme: dark)');
  const icons = {
    system: '<rect x="3" y="4" width="18" height="13" rx="2"/><path d="M8 21h8M12 17v4"/>',
    light: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42"/>',
    dark: '<path d="M20.9 13.2A9 9 0 0 1 10.8 3.1a9 9 0 1 0 10.1 10.1Z"/>'
  };
  const svg = (name) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[name]}</svg>`;
  let preference = 'system';
  try { const saved = localStorage.getItem(KEY); if (['system','light','dark'].includes(saved)) preference = saved; } catch (_) { /* storage blocked */ }
  const resolvedTheme = () => preference === 'system' ? (media.matches ? 'dark' : 'light') : preference;
  const applyTheme = () => {
    const effective = resolvedTheme();
    document.documentElement.dataset.theme = effective;
    document.documentElement.dataset.themePreference = preference;
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', effective === 'dark' ? '#0a1d33' : '#0d2138');
    const trigger = document.getElementById('mi-theme-trigger');
    if (trigger) {
      trigger.innerHTML = svg(effective);
      trigger.title = `Tema atual: ${preference === 'system' ? 'Sistema' : (effective === 'dark' ? 'Escuro' : 'Claro')}. Alterar tema`;
      trigger.setAttribute('aria-label', trigger.title);
    }
    document.querySelectorAll('.mi-theme-option').forEach(btn => {
      btn.setAttribute('aria-pressed', String(btn.dataset.value === preference));
    });
  };
  applyTheme();
  const update = (value) => {
    preference = value;
    try { localStorage.setItem(KEY, value); } catch (_) { /* no storage */ }
    applyTheme();
  };
  if (typeof media.addEventListener === 'function') media.addEventListener('change', applyTheme);
  else if (typeof media.addListener === 'function') media.addListener(applyTheme);

  // Alguns templates nomeiam a seção de serviços de formas diferentes.
  // Marcamos apenas a seção que contém o título/etiqueta "O QUE FAZEMOS".
  const markServicesArea = () => {
    const normalized = (value) => (value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, ' ').trim().toUpperCase();
    const sections = Array.from(document.querySelectorAll('main section, section'));
    let section = sections.find(el => {
      const label = Array.from(el.querySelectorAll('span, small, p, div, h2, h3'))
        .some(child => child.children.length === 0 && normalized(child.textContent) === 'O QUE FAZEMOS');
      return label;
    });
    if (!section) section = document.querySelector('#servicos, #o-que-fazemos');
    if (!section) return;
    section.classList.add('mi-services-area');
    const title = section.querySelector('h2, h1');
    if (title) title.classList.add('mi-services-title');
    const label = Array.from(section.querySelectorAll('span, small, p, div, h3'))
      .find(el => el.children.length === 0 && normalized(el.textContent) === 'O QUE FAZEMOS');
    if (label) label.classList.add('mi-services-kicker');
    // Preferimos o parágrafo de introdução, não textos dentro dos cartões de serviço.
    const intro = Array.from(section.querySelectorAll('p')).find(p => !p.closest('article, .card, [class*="card"]'));
    if (intro) intro.classList.add('mi-services-intro');
  };

  // Ajustes cirúrgicos para as seções que aparecem nos prints da Mattos Infra.
  // Os nomes de classe do template podem variar; identificar pelo título evita
  // depender de um seletor que não existe na versão real do usuário.
  const markProblemCards = () => {
    const norm = text => (text || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, ' ').trim().toUpperCase();
    const sections = Array.from(document.querySelectorAll('main section, section'));
    const sectionByLabel = (label, fallback) => sections.find(section =>
      Array.from(section.querySelectorAll('span, small, div, p, h2, h3, strong')).some(node =>
        node.children.length === 0 && norm(node.textContent) === label
      )) || document.querySelector(fallback);

    const process = sectionByLabel('COMO FUNCIONA', '#como-funciona');
    const attendance = sectionByLabel('FORMAS DE ATENDIMENTO', '#planos, #formas-de-atendimento');
    if (process) process.classList.add('mi-process-area');
    if (attendance) attendance.classList.add('mi-attendance-area');

    const getCard = (title, section) => {
      if (!section) return null;
      const headings = Array.from(section.querySelectorAll('h2, h3, h4, strong, b'));
      const heading = headings.find(item => norm(item.textContent) === title);
      if (!heading) return null;
      const direct = heading.closest('article, li, [class*="card"], [class*="step"], [class*="item"]');
      if (direct && direct !== section && direct.querySelector('p')) return direct;
      let candidate = heading.parentElement;
      for (let depth = 0; candidate && candidate !== section && depth < 5; depth++, candidate = candidate.parentElement) {
        if (candidate.querySelector('p')) {
          // Uma seção contendo quatro títulos não pode ser um único cartão.
          const count = candidate.querySelectorAll('h2, h3, h4').length;
          if (count === 1) return candidate;
        }
      }
      return null;
    };

    ['VOCE ENTRA EM CONTATO', 'AVALIAMOS O CENARIO', 'DEFINIMOS O SERVICO',
      'EXECUTAMOS E ORIENTAMOS'].forEach(name => {
      const card = getCard(name, process);
      if (card) card.classList.add('mi-process-card');
    });
    ['ATENDIMENTO PONTUAL', 'PROJETOS SOB DEMANDA', 'ACOMPANHAMENTO RECORRENTE',
      'ATENDIMENTO AVULSO', 'SUPORTE RECORRENTE', 'PROJETOS DE TI'].forEach(name => {
      const card = getCard(name, attendance);
      if (card) card.classList.add('mi-attendance-card');
    });
  };

  const install = () => {
    markProblemCards();
    markServicesArea();
    const header = document.querySelector('.site-header .header-inner') || document.querySelector('header .container') || document.querySelector('header');
    if (!header || document.querySelector('.mi-theme-control')) return;
    const control = document.createElement('div');
    control.className = 'mi-theme-control';
    control.innerHTML = `
      <button id="mi-theme-trigger" class="mi-theme-trigger" type="button" aria-controls="mi-theme-popover" aria-expanded="false" aria-haspopup="true" aria-label="Alterar tema"></button>
      <div class="mi-theme-popover" id="mi-theme-popover" role="group" aria-label="Escolher aparência" hidden>
        <button type="button" class="mi-theme-option" data-value="system" aria-pressed="false">${svg('system')}<span>Sistema</span></button>
        <button type="button" class="mi-theme-option" data-value="dark" aria-pressed="false">${svg('dark')}<span>Escuro</span></button>
        <button type="button" class="mi-theme-option" data-value="light" aria-pressed="false">${svg('light')}<span>Claro</span></button>
      </div>`;
    header.append(control);
    const trigger = control.querySelector('#mi-theme-trigger');
    const popover = control.querySelector('#mi-theme-popover');
    const setOpen = (open) => {
      popover.hidden = !open;
      trigger.setAttribute('aria-expanded', String(open));
    };
    trigger.addEventListener('click', () => setOpen(popover.hidden));
    control.querySelectorAll('.mi-theme-option').forEach(btn => btn.addEventListener('click', () => {
      update(btn.dataset.value);
      setOpen(false);
      trigger.focus();
    }));
    document.addEventListener('pointerdown', (e) => {
      if (!control.contains(e.target)) setOpen(false);
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !popover.hidden) { setOpen(false); trigger.focus(); }
    });
    applyTheme();
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', install, {once:true});
  else install();
})();
