/* ==========================================================================
   CATALOG — render del grid, filtros, orden, búsqueda y "Añadir al carrito"
   Filtros combinables: audience (Mujer/Hombre/Niños) + line (Fitness/Swimwear)
                        + tag (Más vendidos/Nuevos/Ofertas) + query (búsqueda)
   ========================================================================== */
window.Nanis = window.Nanis || {};

Nanis.catalog = (function () {
  const { $, $$, escapeHTML, normalize, formatPrice, icon, starsHTML } = Nanis.utils;

  const LABELS = {
    audience: { mujer: 'Mujer', hombre: 'Hombre', ninos: 'Niños' },
    line: { fitness: 'Fitness', swimwear: 'Swimwear' },
    tag: { bestseller: 'Lo más vendido', new: 'Nuevos ingresos', sale: 'Ofertas' }
  };

  const DEFAULTS = { audience: 'all', line: 'all', tag: 'all', query: '', sort: 'relevance' };
  let filters = { ...DEFAULTS };

  /* ---------- Filtrado y orden ---------- */

  function matches(p) {
    if (filters.audience !== 'all' && p.audience !== filters.audience) return false;
    if (filters.line !== 'all' && p.line !== filters.line) return false;
    if (filters.tag !== 'all' && !p.tags.includes(filters.tag)) return false;
    if (filters.query) {
      const haystack = normalize([p.name, LABELS.line[p.line], LABELS.audience[p.audience], ...p.colors.map((c) => c.name)].join(' '));
      // Todas las palabras de la búsqueda deben aparecer
      if (!normalize(filters.query).split(/\s+/).every((w) => haystack.includes(w))) return false;
    }
    return true;
  }

  const SORTERS = {
    relevance: () => 0,
    'price-asc': (a, b) => a.price - b.price,
    'price-desc': (a, b) => b.price - a.price,
    rating: (a, b) => b.rating - a.rating || b.reviews - a.reviews
  };

  const getVisible = () => Nanis.products.filter(matches).sort(SORTERS[filters.sort]);

  /* ---------- Templates ---------- */

  function cardHTML(p) {
    const discount = p.compareAt ? Math.round((1 - p.price / p.compareAt) * 100) : 0;
    const badges = [
      discount ? `<span class="badge badge--sale">-${discount}%</span>` : '',
      p.tags.includes('new') ? '<span class="badge badge--new">Nuevo</span>' : '',
      p.tags.includes('bestseller') ? '<span class="badge">Top ventas</span>' : ''
    ].join('');

    const colors = p.colors.map((c, i) => `
      <label title="${escapeHTML(c.name)}">
        <input type="radio" name="color-${p.id}" value="${escapeHTML(c.name)}" ${i === 0 ? 'checked' : ''}>
        <span class="swatch" style="--c:${c.hex}"></span>
        <span class="sr-only">${escapeHTML(c.name)}</span>
      </label>`).join('');

    // Talla única → se preselecciona; si hay varias, la clienta debe elegir
    const single = p.sizes.length === 1;
    const sizes = p.sizes.map((s) => `
      <label>
        <input type="radio" name="size-${p.id}" value="${escapeHTML(s)}" ${single ? 'checked' : ''}>
        <span class="size">${escapeHTML(s)}</span>
      </label>`).join('');

    return `
      <article class="product-card" data-id="${p.id}">
        <div class="product-card__media" data-fallback="${escapeHTML(p.name)}">
          <img class="js-img" src="${p.image}" alt="${escapeHTML(p.name)}" loading="lazy" width="700" height="875">
          <div class="badges">${badges}</div>
        </div>
        <div class="product-card__body">
          <p class="product-card__line">${LABELS.line[p.line]} · ${LABELS.audience[p.audience]}</p>
          <h3 class="product-card__name">${escapeHTML(p.name)}</h3>
          <div class="rating">${starsHTML(p.rating)} <span>${p.rating} (${p.reviews})</span></div>
          <div class="price">
            <span class="price__now ${discount ? 'price__now--sale' : ''}">${formatPrice(p.price)}</span>
            ${p.compareAt ? `<span class="price__was">${formatPrice(p.compareAt)}</span>` : ''}
          </div>
          <fieldset class="variant" data-variant="color">
            <legend class="variant__label">Color: <b data-color-name>${escapeHTML(p.colors[0].name)}</b></legend>
            <div class="variant__options">${colors}</div>
          </fieldset>
          <fieldset class="variant" data-variant="size">
            <legend class="variant__label">Talla</legend>
            <div class="variant__options">${sizes}</div>
          </fieldset>
          <p class="product-card__hint" aria-live="polite"></p>
          <button type="button" class="btn btn--dark btn--block product-card__add js-add">
            ${icon('cart')} <span>Añadir al carrito</span>
          </button>
        </div>
      </article>`;
  }

  /* ---------- Render ---------- */

  function render() {
    const list = getVisible();
    $('#product-grid').innerHTML = list.map(cardHTML).join('');
    $('#catalog-empty').hidden = list.length > 0;
    $('#catalog-count').textContent = `${list.length} producto${list.length === 1 ? '' : 's'}`;
    renderControls();
    return list.length;
  }

  /** Refleja el estado de filtros en chips, selects, pills y menú. */
  function renderControls() {
    $$('#tag-filters .chip').forEach((chip) => {
      const on = chip.dataset.tag === filters.tag;
      chip.classList.toggle('is-active', on);
      chip.setAttribute('aria-pressed', String(on));
    });
    $('#line-filter').value = filters.line;
    $('#sort-filter').value = filters.sort;

    const pills = [];
    if (filters.audience !== 'all') pills.push(['audience', LABELS.audience[filters.audience]]);
    if (filters.query) pills.push(['query', `"${filters.query}"`]);
    $('#active-filters').innerHTML = pills.map(([key, label]) => `
      <span class="filter-pill">${escapeHTML(label)}
        <button type="button" data-clear="${key}" aria-label="Quitar filtro ${escapeHTML(label)}">${icon('close')}</button>
      </span>`).join('');

    // Marca el enlace activo del menú principal
    $$('.main-nav a').forEach((a) => {
      const [k, v] = a.dataset.filter.split(':');
      a.classList.toggle('is-active', filters[k] === v);
    });
  }

  /* ---------- API pública de filtros ---------- */

  /** Cambia un filtro y re-renderiza. Devuelve el nº de resultados. */
  function setFilter(key, value) {
    filters[key] = value;
    return render();
  }

  function reset() {
    filters = { ...DEFAULTS };
    Nanis.header.clearSearchInput();
    return render();
  }

  /**
   * Aplica un filtro desde un atributo data-filter="clave:valor" (menú, hero, categorías).
   * Cada acceso directo parte de un catálogo limpio para que el resultado sea predecible.
   */
  function applyShortcut(str) {
    if (str === 'reset') return reset();
    const [key, value] = str.split(':');
    filters = { ...DEFAULTS, sort: filters.sort, [key]: value };
    Nanis.header.clearSearchInput();
    return render();
  }

  /* ---------- Añadir al carrito ---------- */

  function handleAdd(card, button) {
    const product = Nanis.productById(card.dataset.id);
    const color = card.querySelector(`input[name="color-${product.id}"]:checked`);
    const size = card.querySelector(`input[name="size-${product.id}"]:checked`);
    const sizeGroup = card.querySelector('[data-variant="size"]');
    const hint = card.querySelector('.product-card__hint');

    if (!size) {
      hint.textContent = 'Elige tu talla para continuar';
      sizeGroup.classList.remove('is-invalid');
      void sizeGroup.offsetWidth; // reinicia la animación
      sizeGroup.classList.add('is-invalid');
      return;
    }

    Nanis.cart.add(product.id, { color: color.value, size: size.value });

    // Feedback inmediato en el botón
    const label = button.querySelector('span');
    button.classList.add('is-added');
    label.textContent = '¡Añadido!';
    setTimeout(() => { button.classList.remove('is-added'); label.textContent = 'Añadir al carrito'; }, 1400);

    Nanis.toast.show({
      title: 'Añadido al carrito',
      subtitle: `${product.name} · ${color.value} · ${size.value}`,
      image: product.image,
      action: { label: 'Ver carrito', onClick: () => Nanis.cartDrawer.open() }
    });
  }

  /* ---------- Eventos ---------- */

  function bindEvents() {
    const grid = $('#product-grid');

    grid.addEventListener('click', (e) => {
      const btn = e.target.closest('.js-add');
      if (btn) handleAdd(btn.closest('.product-card'), btn);
    });

    grid.addEventListener('change', (e) => {
      const card = e.target.closest('.product-card');
      if (e.target.name.startsWith('color-')) {
        card.querySelector('[data-color-name]').textContent = e.target.value;
      }
      if (e.target.name.startsWith('size-')) {
        card.querySelector('[data-variant="size"]').classList.remove('is-invalid');
        card.querySelector('.product-card__hint').textContent = '';
      }
    });

    $('#tag-filters').addEventListener('click', (e) => {
      const chip = e.target.closest('.chip');
      if (chip) setFilter('tag', chip.dataset.tag);
    });
    $('#line-filter').addEventListener('change', (e) => setFilter('line', e.target.value));
    $('#sort-filter').addEventListener('change', (e) => setFilter('sort', e.target.value));

    $('#active-filters').addEventListener('click', (e) => {
      const btn = e.target.closest('[data-clear]');
      if (!btn) return;
      const key = btn.dataset.clear;
      if (key === 'query') Nanis.header.clearSearchInput();
      setFilter(key, DEFAULTS[key]);
    });

    // Atajos globales: cualquier elemento con data-filter (menú, hero, categorías, footer)
    document.addEventListener('click', (e) => {
      const el = e.target.closest('[data-filter]');
      if (el) applyShortcut(el.dataset.filter);
    });
  }

  /* ---------- Mosaico de comunidad (reutiliza fotos del catálogo) ---------- */
  function renderMosaic() {
    const el = $('#community-mosaic');
    if (!el) return;
    el.innerHTML = Nanis.products.slice(0, 6)
      .map((p) => `<img class="js-img" src="${p.image}" alt="" loading="lazy">`).join('');
  }

  function init() {
    bindEvents();
    render();
    renderMosaic();
  }

  return { init, render, setFilter, reset, applyShortcut };
})();
