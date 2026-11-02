/* ==========================================================================
   THEME — modo claro/oscuro
   El tema inicial lo fija un script inline en <head> (evita parpadeo).
   Este módulo solo gestiona el cambio y la persistencia.
   ========================================================================== */
window.Nanis = window.Nanis || {};

Nanis.theme = (function () {
  const KEY = Nanis.config.storageKeys.theme;
  const root = document.documentElement;
  const META_COLORS = { light: '#FBF8F5', dark: '#151211' };

  const current = () => root.dataset.theme === 'dark' ? 'dark' : 'light';

  function apply(theme) {
    root.dataset.theme = theme;
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', META_COLORS[theme]);
  }

  function toggle() {
    const next = current() === 'dark' ? 'light' : 'dark';
    apply(next);
    try { localStorage.setItem(KEY, next); } catch (e) { /* sin persistencia */ }
  }

  function init() {
    apply(current());
    document.querySelectorAll('[data-theme-toggle]').forEach((btn) => btn.addEventListener('click', toggle));

    // Si la usuaria nunca eligió, sigue los cambios del sistema
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      let saved = null;
      try { saved = localStorage.getItem(KEY); } catch (err) { /* noop */ }
      if (!saved) apply(e.matches ? 'dark' : 'light');
    });
  }

  return { init, toggle, current };
})();
