/* ==========================================================================
   CART STORE — lógica pura del carrito (sin DOM)
   - Estado: { items: [{ key, id, color, size, qty }], coupon: 'CODE' | null }
   - Persiste en localStorage.
   - Patrón pub/sub: la UI se suscribe con Nanis.cart.subscribe(fn).
   Precios y nombres se resuelven siempre desde el catálogo, así un cambio de
   precio nunca deja un valor viejo guardado en el carrito.
   ========================================================================== */
window.Nanis = window.Nanis || {};

Nanis.cart = (function () {
  const { config, utils } = Nanis;
  const KEY = config.storageKeys.cart;
  const listeners = new Set();

  let state = load();

  /* ---------- Persistencia ---------- */
  function load() {
    const saved = utils.storage.get(KEY, null);
    if (!saved || !Array.isArray(saved.items)) return { items: [], coupon: null };
    // Descarta productos que ya no existen en el catálogo
    return {
      items: saved.items.filter((i) => Nanis.productById(i.id)),
      coupon: config.coupons[saved.coupon] ? saved.coupon : null
    };
  }

  function commit(meta = {}) {
    utils.storage.set(KEY, state);
    const snapshot = getSnapshot();
    listeners.forEach((fn) => fn(snapshot, meta));
  }

  /* ---------- Helpers ---------- */
  const lineKey = (id, color, size) => `${id}__${color}__${size}`;
  const findLine = (key) => state.items.find((i) => i.key === key);
  const clampQty = (q) => Math.max(1, Math.min(config.maxQtyPerItem, q));

  /* ---------- Acciones ---------- */

  /** Añade un producto (o suma cantidad si ya existe la misma variante). */
  function add(id, { color, size, qty = 1 }) {
    if (!Nanis.productById(id)) return;
    const key = lineKey(id, color, size);
    const line = findLine(key);
    if (line) line.qty = clampQty(line.qty + qty);
    else state.items.unshift({ key, id, color, size, qty: clampQty(qty) });
    commit({ type: 'add', key });
  }

  function setQty(key, qty) {
    const line = findLine(key);
    if (!line) return;
    if (qty <= 0) return remove(key);
    line.qty = clampQty(qty);
    commit({ type: 'qty', key });
  }

  const increment = (key) => { const l = findLine(key); if (l) setQty(key, l.qty + 1); };
  const decrement = (key) => { const l = findLine(key); if (l) setQty(key, l.qty - 1); };

  function remove(key) {
    state.items = state.items.filter((i) => i.key !== key);
    commit({ type: 'remove', key });
  }

  function clear() {
    state = { items: [], coupon: null };
    commit({ type: 'clear' });
  }

  /**
   * Valida y aplica un cupón.
   * @returns {{ ok: boolean, message: string }}
   */
  function applyCoupon(rawCode) {
    const code = String(rawCode || '').trim().toUpperCase();
    if (!code) return { ok: false, message: 'Ingresa un código.' };

    const coupon = config.coupons[code];
    if (!coupon) return { ok: false, message: 'Este código no es válido.' };

    const { subtotal } = getTotals();
    if (coupon.minSubtotal && subtotal < coupon.minSubtotal) {
      return { ok: false, message: `Válido en compras desde ${utils.formatPrice(coupon.minSubtotal)}.` };
    }

    state.coupon = code;
    commit({ type: 'coupon' });
    return { ok: true, message: `¡Listo! ${coupon.label} aplicado.` };
  }

  function removeCoupon() {
    state.coupon = null;
    commit({ type: 'coupon' });
  }

  /* ---------- Lecturas ---------- */

  /** Líneas enriquecidas con los datos del producto. */
  function getLines() {
    return state.items.map((i) => {
      const p = Nanis.productById(i.id);
      const colorObj = p.colors.find((c) => c.name === i.color) || p.colors[0];
      return { ...i, product: p, colorHex: colorObj.hex, unitPrice: p.price, lineTotal: utils.round2(p.price * i.qty) };
    });
  }

  function getTotals() {
    const lines = getLines();
    const count = lines.reduce((n, l) => n + l.qty, 0);
    const subtotal = utils.round2(lines.reduce((s, l) => s + l.lineTotal, 0));

    let coupon = state.coupon ? config.coupons[state.coupon] : null;
    // Si el carrito bajó del mínimo del cupón, deja de aplicar (pero no se borra)
    const couponActive = !!coupon && !(coupon.minSubtotal && subtotal < coupon.minSubtotal);
    if (!couponActive) coupon = null;

    let discount = 0;
    if (coupon && coupon.type === 'percent') discount = utils.round2(subtotal * coupon.value / 100);
    if (coupon && coupon.type === 'fixed') discount = Math.min(coupon.value, subtotal);

    const afterDiscount = utils.round2(subtotal - discount);
    const { flatRate, freeThreshold } = config.shipping;
    const freeByCoupon = coupon && coupon.type === 'shipping';
    const qualifiesFree = afterDiscount >= freeThreshold;
    const shipping = count === 0 || freeByCoupon || qualifiesFree ? 0 : flatRate;

    return {
      count,
      subtotal,
      discount,
      shipping,
      total: utils.round2(afterDiscount + shipping),
      couponCode: state.coupon,
      couponActive,
      // Para la barra de progreso de envío gratis
      remainingForFree: Math.max(0, utils.round2(freeThreshold - afterDiscount)),
      freeProgress: Math.min(1, afterDiscount / freeThreshold),
      freeShipping: count > 0 && shipping === 0
    };
  }

  const getSnapshot = () => ({ lines: getLines(), totals: getTotals() });

  function subscribe(fn) {
    listeners.add(fn);
    return () => listeners.delete(fn);
  }

  // Sincroniza el carrito entre pestañas abiertas
  window.addEventListener('storage', (e) => {
    if (e.key === KEY) { state = load(); listeners.forEach((fn) => fn(getSnapshot(), { type: 'sync' })); }
  });

  return { add, setQty, increment, decrement, remove, clear, applyCoupon, removeCoupon, getLines, getTotals, getSnapshot, subscribe };
})();
