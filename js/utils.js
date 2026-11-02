/* ==========================================================================
   UTILS — helpers sin dependencias reutilizados por todos los módulos
   ========================================================================== */
window.Nanis = window.Nanis || {};

Nanis.utils = (function () {
  const { currency } = Nanis.config;
  const money = new Intl.NumberFormat(currency.locale, { style: 'currency', currency: currency.code });

  /** 38 → "$38.00" */
  const formatPrice = (n) => money.format(n);

  /** Redondeo monetario a 2 decimales (evita 0.1 + 0.2 = 0.30000000000000004). */
  const round2 = (n) => Math.round((n + Number.EPSILON) * 100) / 100;

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  /** Escapa texto antes de insertarlo como HTML. */
  const escapeHTML = (str) => String(str).replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ));

  /** Normaliza para búsquedas: minúsculas y sin acentos ("Niños" → "ninos"). */
  const normalize = (str) => String(str).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

  const debounce = (fn, ms = 200) => {
    let t;
    return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
  };

  /** localStorage protegido: en modo privado o bloqueado no rompe la app. */
  const storage = {
    get(key, fallback = null) {
      try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; }
      catch (e) { return fallback; }
    },
    set(key, value) {
      try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* sin persistencia */ }
    }
  };

  /** <svg> que referencia el sprite de index.html. */
  const icon = (name, cls = '') => `<svg class="${cls}" aria-hidden="true"><use href="#i-${name}"/></svg>`;

  /** 5 estrellas: llenas hasta el redondeo del rating. */
  const starsHTML = (rating) => {
    const full = Math.round(rating);
    let out = '';
    for (let i = 1; i <= 5; i++) out += icon('star', i <= full ? '' : 'is-empty');
    return `<span class="stars" aria-label="${rating} de 5 estrellas">${out}</span>`;
  };

  return { formatPrice, round2, $, $$, escapeHTML, normalize, debounce, storage, icon, starsHTML };
})();
