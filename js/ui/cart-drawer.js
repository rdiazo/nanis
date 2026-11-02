/* ==========================================================================
   CART DRAWER — UI del carrito (slide-over)
   Escucha a Nanis.cart y re-renderiza; no contiene reglas de negocio.
   ========================================================================== */
window.Nanis = window.Nanis || {};

Nanis.cartDrawer = (function () {
  const { $, $$, escapeHTML, formatPrice, icon } = Nanis.utils;
  const { config, cart } = Nanis;

  let lastFocus = null;
  const drawer = () => $('#cart-drawer');
  const isOpen = () => drawer().classList.contains('is-open');

  /* ---------- Abrir / cerrar (con gestión de foco) ---------- */

  function open() {
    if (isOpen()) return;
    Nanis.header.closeMenu();
    lastFocus = document.activeElement;
    drawer().classList.add('is-open');
    drawer().setAttribute('aria-hidden', 'false');
    $('#cart-overlay').hidden = false;
    $('#cart-open').setAttribute('aria-expanded', 'true');
    document.body.classList.add('is-locked');
    $('#cart-close').focus();
  }

  function close() {
    if (!isOpen()) return;
    drawer().classList.remove('is-open');
    drawer().setAttribute('aria-hidden', 'true');
    $('#cart-overlay').hidden = true;
    $('#cart-open').setAttribute('aria-expanded', 'false');
    document.body.classList.remove('is-locked');
    if (lastFocus) lastFocus.focus();
  }

  /** Mantiene el foco de teclado dentro del carrito mientras está abierto. */
  function trapFocus(e) {
    if (e.key !== 'Tab' || !isOpen()) return;
    const focusables = $$('button:not([disabled]), a[href], input', drawer()).filter((el) => el.offsetParent !== null);
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  /* ---------- Templates ---------- */

  function lineHTML(l) {
    const max = config.maxQtyPerItem;
    return `
      <li class="cart-item" data-key="${escapeHTML(l.key)}">
        <div class="cart-item__img" data-fallback="">
          <img class="js-img" src="${l.product.image}" alt="" loading="lazy">
        </div>
        <div class="cart-item__info">
          <div class="cart-item__top">
            <p class="cart-item__name">${escapeHTML(l.product.name)}</p>
            <button class="icon-btn cart-item__remove" data-action="remove" aria-label="Eliminar ${escapeHTML(l.product.name)}">${icon('trash')}</button>
          </div>
          <p class="cart-item__meta">
            <span class="cart-item__dot" style="--c:${l.colorHex}"></span>${escapeHTML(l.color)} · Talla ${escapeHTML(l.size)}
          </p>
          <p class="cart-item__meta">${formatPrice(l.unitPrice)} c/u</p>
          <div class="cart-item__bottom">
            <div class="qty" role="group" aria-label="Cantidad">
              <button data-action="dec" aria-label="Restar uno" ${l.qty <= 1 ? 'disabled' : ''}>${icon('minus')}</button>
              <output aria-live="polite">${l.qty}</output>
              <button data-action="inc" aria-label="Sumar uno" ${l.qty >= max ? 'disabled' : ''}>${icon('plus')}</button>
            </div>
            <span class="cart-item__price">${formatPrice(l.lineTotal)}</span>
          </div>
        </div>
      </li>`;
  }

  /* ---------- Render ---------- */

  function render({ lines, totals }, meta = {}) {
    const empty = lines.length === 0;

    // Contadores (header + título)
    $$('[data-cart-count]').forEach((el) => {
      el.textContent = totals.count;
      el.classList.toggle('has-items', totals.count > 0);
    });
    $('[data-cart-count-label]').textContent = totals.count ? `(${totals.count})` : '';
    if (meta.type === 'add') bumpBadge();

    // Lista
    $('#cart-items').innerHTML = lines.map(lineHTML).join('');
    $('#cart-empty').hidden = !empty;
    $('#cart-foot').hidden = empty;
    $('#shipping-progress').hidden = empty;

    // Barra de envío gratis
    $('#shipping-progress-fill').style.width = `${Math.round(totals.freeProgress * 100)}%`;
    $('#shipping-progress-text').innerHTML = totals.freeShipping
      ? '🎉 <strong>¡Tienes envío GRATIS!</strong>'
      : `Te faltan <strong>${formatPrice(totals.remainingForFree)}</strong> para el envío gratis`;

    // Resumen
    $('#sum-subtotal').textContent = formatPrice(totals.subtotal);
    $('#sum-discount-row').hidden = totals.discount <= 0;
    $('#sum-discount').textContent = `−${formatPrice(totals.discount)}`;
    $('#sum-coupon').textContent = totals.couponActive ? `(${totals.couponCode})` : '';
    const ship = $('#sum-shipping');
    ship.textContent = totals.shipping === 0 ? 'Gratis' : formatPrice(totals.shipping);
    ship.classList.toggle('is-free', totals.shipping === 0);
    $('#sum-total').textContent = formatPrice(totals.total);

    renderCouponState(totals);
  }

  function renderCouponState(totals) {
    const msg = $('#coupon-msg');
    if (!totals.couponCode) {
      // Limpia el aviso de un cupón ya retirado (los errores de validación se conservan)
      if (!msg.classList.contains('is-error')) msg.textContent = '';
      return;
    }
    const coupon = config.coupons[totals.couponCode];
    if (totals.couponActive) {
      msg.className = 'coupon__msg is-ok';
      msg.innerHTML = `Cupón <strong>${escapeHTML(totals.couponCode)}</strong>: ${escapeHTML(coupon.label)} <button type="button" data-action="remove-coupon">Quitar</button>`;
    } else {
      msg.className = 'coupon__msg is-error';
      msg.innerHTML = `${escapeHTML(totals.couponCode)} requiere compras desde ${formatPrice(coupon.minSubtotal)}. <button type="button" data-action="remove-coupon">Quitar</button>`;
    }
  }

  function bumpBadge() {
    const btn = $('#cart-open');
    btn.classList.remove('is-bumping');
    void btn.offsetWidth;
    btn.classList.add('is-bumping');
  }

  /* ---------- Checkout ----------
     PUNTO DE INTEGRACIÓN: hoy arma el pedido y lo envía por WhatsApp.
     Para una pasarela (Stripe, PayPal, Shopify, WooCommerce) reemplaza el
     cuerpo de esta función por la llamada a su API con `lines` y `totals`. */
  function checkout() {
    const { lines, totals } = cart.getSnapshot();
    if (!lines.length) return;

    const items = lines.map((l) =>
      `• ${l.qty}x ${l.product.name} (${l.color}, talla ${l.size}) — ${formatPrice(l.lineTotal)}`
    ).join('\n');

    const summary = [
      `Subtotal: ${formatPrice(totals.subtotal)}`,
      totals.discount > 0 ? `Descuento (${totals.couponCode}): −${formatPrice(totals.discount)}` : null,
      `Envío: ${totals.shipping === 0 ? 'Gratis' : formatPrice(totals.shipping)}`,
      `*Total: ${formatPrice(totals.total)}*`
    ].filter(Boolean).join('\n');

    const message = `¡Hola ${config.storeName}! 👋 Quiero hacer este pedido:\n\n${items}\n\n${summary}\n\n¿Me indican los datos de pago y envío? 💕`;
    window.open(`https://wa.me/${config.contact.whatsapp}?text=${encodeURIComponent(message)}`, '_blank', 'noopener');
  }

  /* ---------- Eventos ---------- */

  function bindEvents() {
    $('#cart-open').addEventListener('click', open);
    $('#cart-close').addEventListener('click', close);
    $('#cart-overlay').addEventListener('click', close);
    $$('[data-cart-dismiss]').forEach((el) => el.addEventListener('click', close));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); trapFocus(e); });

    // Cantidades / eliminar (delegación)
    $('#cart-items').addEventListener('click', (e) => {
      const btn = e.target.closest('[data-action]');
      if (!btn) return;
      const key = btn.closest('.cart-item').dataset.key;
      const actions = { inc: cart.increment, dec: cart.decrement, remove: cart.remove };
      actions[btn.dataset.action](key);
      // Tras re-render, devuelve el foco al mismo control para uso con teclado
      const same = $(`.cart-item[data-key="${CSS.escape(key)}"] [data-action="${btn.dataset.action}"]`);
      (same && !same.disabled ? same : $('#cart-close')).focus();
    });

    // Cupón
    $('#coupon-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const input = $('#coupon-input');
      const res = cart.applyCoupon(input.value);
      const msg = $('#coupon-msg');
      if (res.ok) input.value = '';
      else { msg.className = 'coupon__msg is-error'; msg.textContent = res.message; }
    });
    $('#coupon-msg').addEventListener('click', (e) => {
      if (e.target.closest('[data-action="remove-coupon"]')) {
        cart.removeCoupon();
        $('#coupon-msg').textContent = '';
      }
    });

    $('#checkout-btn').addEventListener('click', checkout);
  }

  function init() {
    bindEvents();
    cart.subscribe(render);
    render(cart.getSnapshot());
  }

  return { init, open, close, checkout };
})();
