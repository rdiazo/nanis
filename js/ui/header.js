/* ==========================================================================
   HEADER — sombra al hacer scroll, menú móvil y barra de búsqueda
   ========================================================================== */
window.Nanis = window.Nanis || {};

Nanis.header = (function () {
  const { $, debounce } = Nanis.utils;

  /* ---------- Sticky: añade sombra tras hacer scroll ---------- */
  function initSticky() {
    const header = $('#site-header');
    const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Menú móvil (off-canvas) ---------- */
  const nav = () => $('#mobile-nav');

  function openMenu() {
    nav().classList.add('is-open');
    nav().setAttribute('aria-hidden', 'false');
    $('#nav-overlay').hidden = false;
    $('#menu-open').setAttribute('aria-expanded', 'true');
    document.body.classList.add('is-locked');
    $('#menu-close').focus();
  }

  function closeMenu() {
    if (!nav().classList.contains('is-open')) return;
    nav().classList.remove('is-open');
    nav().setAttribute('aria-hidden', 'true');
    $('#nav-overlay').hidden = true;
    $('#menu-open').setAttribute('aria-expanded', 'false');
    document.body.classList.remove('is-locked');
  }

  function initMobileMenu() {
    $('#menu-open').addEventListener('click', openMenu);
    $('#menu-close').addEventListener('click', closeMenu);
    $('#nav-overlay').addEventListener('click', closeMenu);
    // Cualquier enlace del menú lo cierra
    nav().addEventListener('click', (e) => { if (e.target.closest('a')) closeMenu(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMenu(); });
  }

  /* ---------- Búsqueda: filtra el catálogo en vivo ---------- */
  function initSearch() {
    const toggle = $('#search-toggle');
    const panel = $('#search-panel');
    const input = $('#search-input');

    toggle.addEventListener('click', () => {
      const willOpen = panel.hidden;
      panel.hidden = !willOpen;
      toggle.setAttribute('aria-expanded', String(willOpen));
      if (willOpen) input.focus();
    });

    const run = debounce(() => {
      const count = Nanis.catalog.setFilter('query', input.value.trim());
      $('#search-meta').textContent = input.value.trim()
        ? `${count} resultado${count === 1 ? '' : 's'} · pulsa Enter para verlos`
        : '';
    }, 180);
    input.addEventListener('input', run);

    $('#search-form').addEventListener('submit', (e) => {
      e.preventDefault();
      $('#catalogo').scrollIntoView({ behavior: 'smooth' });
    });

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') { panel.hidden = true; toggle.setAttribute('aria-expanded', 'false'); toggle.focus(); }
    });
  }

  /** Sincroniza el input cuando la búsqueda se limpia desde el catálogo. */
  function clearSearchInput() {
    $('#search-input').value = '';
    $('#search-meta').textContent = '';
  }

  function init() {
    initSticky();
    initMobileMenu();
    initSearch();
  }

  return { init, closeMenu, clearSearchInput };
})();
