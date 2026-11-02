/* ==========================================================================
   CONFIG — Ajustes de la tienda. Edita aquí sin tocar la lógica.
   Todos los módulos cuelgan de window.Nanis (funciona desde file:// sin servidor).
   ========================================================================== */
window.Nanis = window.Nanis || {};

Nanis.config = {
  storeName: "Nani's",

  currency: { code: 'USD', locale: 'en-US' },

  shipping: {
    flatRate: 5,          // costo de envío estándar
    freeThreshold: 60     // envío gratis desde este subtotal (tras descuento)
  },

  maxQtyPerItem: 10,

  /* Cupones. type: 'percent' | 'fixed' | 'shipping'
     minSubtotal (opcional): mínimo de compra para que aplique. */
  coupons: {
    BIENVENIDA10: { type: 'percent', value: 10, label: '10% de bienvenida' },
    NANIS15:      { type: 'percent', value: 15, minSubtotal: 80, label: '15% de descuento' },
    ENVIOGRATIS:  { type: 'shipping', label: 'Envío gratis' }
  },

  contact: {
    // TODO: número real en formato internacional sin "+" ni espacios (ej. 584121234567)
    whatsapp: '584120000000',
    email: 'hola@cositasnanis.com',          // TODO: email real
    hours: 'Lun a Sáb · 9:00 a.m. – 7:00 p.m.'
  },

  social: {
    instagram: 'https://www.instagram.com/cositas_nanis',
    tiktok: 'https://www.tiktok.com/@cositas_nanis',
    facebook: 'https://www.facebook.com/share/14szYVwf81p/'
  },

  storageKeys: {
    cart: 'nanis-cart',
    theme: 'nanis-theme'
  }
};
