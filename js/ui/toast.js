/* ==========================================================================
   TOAST — notificaciones breves (p. ej. "Añadido al carrito")
   Uso: Nanis.toast.show({ title, subtitle, image, action: { label, onClick } })
   ========================================================================== */
window.Nanis = window.Nanis || {};

Nanis.toast = (function () {
  const { escapeHTML } = Nanis.utils;
  const DURATION = 3800;
  const MAX_VISIBLE = 2;

  function show({ title, subtitle = '', image = '', action = null }) {
    const region = document.getElementById('toast-region');
    if (!region) return;

    // Limita la cantidad de toasts apilados
    while (region.children.length >= MAX_VISIBLE) region.firstElementChild.remove();

    const el = document.createElement('div');
    el.className = 'toast';
    el.innerHTML = `
      ${image ? `<img class="toast__img" src="${escapeHTML(image)}" alt="">` : ''}
      <p class="toast__text"><strong>${escapeHTML(title)}</strong>${subtitle ? `<small>${escapeHTML(subtitle)}</small>` : ''}</p>
      ${action ? `<button class="toast__action" type="button">${escapeHTML(action.label)}</button>` : ''}
    `;
    if (action) {
      el.querySelector('.toast__action').addEventListener('click', () => { action.onClick(); dismiss(el); });
    }
    region.appendChild(el);

    let timer = setTimeout(() => dismiss(el), DURATION);
    // Pausa al pasar el mouse para que dé tiempo a pulsar la acción
    el.addEventListener('mouseenter', () => clearTimeout(timer));
    el.addEventListener('mouseleave', () => { timer = setTimeout(() => dismiss(el), 1500); });
  }

  function dismiss(el) {
    if (!el.isConnected || el.classList.contains('is-leaving')) return;
    el.classList.add('is-leaving');
    el.addEventListener('animationend', () => el.remove(), { once: true });
  }

  return { show };
})();
