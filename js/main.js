/* ==========================================================================
   MAIN — punto de entrada. Inicializa módulos y rellena datos de config.
   ========================================================================== */
(function () {
  const { config, utils } = Nanis;
  const { $$, formatPrice } = utils;

  /** Vuelca enlaces de redes/contacto desde config.js al HTML. */
  function hydrateStaticContent() {
    $$('[data-social]').forEach((a) => { a.href = config.social[a.dataset.social]; });

    const waHref = `https://wa.me/${config.contact.whatsapp}?text=${encodeURIComponent(`¡Hola ${config.storeName}! Tengo una consulta 😊`)}`;
    $$('[data-contact="whatsapp"]').forEach((a) => { a.href = waHref; });
    $$('[data-contact="email"]').forEach((a) => { a.href = `mailto:${config.contact.email}`; a.textContent = config.contact.email; });
    $$('[data-contact="hours"]').forEach((el) => { el.textContent = config.contact.hours; });

    $$('[data-free-shipping]').forEach((el) => { el.textContent = formatPrice(config.shipping.freeThreshold).replace('.00', ''); });
    $$('[data-year]').forEach((el) => { el.textContent = new Date().getFullYear(); });
  }

  /** Si una imagen falla, muestra un placeholder con el nombre del producto. */
  function handleBrokenImages() {
    document.addEventListener('error', (e) => {
      const img = e.target;
      if (!(img instanceof HTMLImageElement) || !img.classList.contains('js-img')) return;
      const box = img.parentElement;
      if (box && box.hasAttribute('data-fallback')) box.classList.add('is-broken');
      else img.classList.add('is-broken');
    }, true);
  }

  function init() {
    handleBrokenImages();
    hydrateStaticContent();
    Nanis.theme.init();
    Nanis.header.init();
    Nanis.catalog.init();
    Nanis.cartDrawer.init();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
