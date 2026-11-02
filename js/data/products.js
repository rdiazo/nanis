/* ==========================================================================
   CATÁLOGO DE PRODUCTOS (datos de muestra)
   Para conectar una API/CMS, reemplaza este array por la respuesta del fetch.

   Esquema de un producto:
   {
     id:        string único
     name:      nombre visible
     audience:  'mujer' | 'hombre' | 'ninos'
     line:      'fitness' | 'swimwear'
     price:     precio actual
     compareAt: precio anterior (opcional → se muestra tachado y badge -X%)
     rating:    0–5
     reviews:   nº de reseñas
     tags:      ['bestseller' | 'new' | 'sale']
     colors:    [{ name, hex }]
     sizes:     ['XS','S','M','L','XL']
     image:     URL de la foto principal
   }
   ========================================================================== */
window.Nanis = window.Nanis || {};

(function () {
  // Helper para fotos de Unsplash (muestra). Sustituir por fotos propias.
  const img = (id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=700&h=875&q=80`;

  Nanis.products = [
    {
      id: 'leg-sculpt', name: 'Legging Sculpt Push-Up', audience: 'mujer', line: 'fitness',
      price: 38, rating: 4.9, reviews: 214, tags: ['bestseller'],
      colors: [{ name: 'Coral', hex: '#E58C80' }, { name: 'Negro', hex: '#222' }, { name: 'Moca', hex: '#8B6B5C' }],
      sizes: ['XS', 'S', 'M', 'L', 'XL'], image: img('photo-1506629082955-511b1aa562c8')
    },
    {
      id: 'set-flow', name: 'Conjunto Flow Top + Biker', audience: 'mujer', line: 'fitness',
      price: 49, compareAt: 62, rating: 4.8, reviews: 156, tags: ['bestseller', 'sale'],
      colors: [{ name: 'Menta', hex: '#9ED8C3' }, { name: 'Nude', hex: '#E7CDBB' }],
      sizes: ['S', 'M', 'L'], image: img('photo-1518611012118-696072aa579a')
    },
    {
      id: 'bikini-sol', name: 'Bikini Sol Triángulo', audience: 'mujer', line: 'swimwear',
      price: 42, rating: 4.9, reviews: 98, tags: ['new', 'bestseller'],
      colors: [{ name: 'Terracota', hex: '#C96B4F' }, { name: 'Blanco', hex: '#F4F1EC' }, { name: 'Lila', hex: '#BBA6D9' }],
      sizes: ['XS', 'S', 'M', 'L'], image: img('photo-1570976447640-ac859083963f')
    },
    {
      id: 'top-airy', name: 'Top Deportivo Airy', audience: 'mujer', line: 'fitness',
      price: 24, rating: 4.7, reviews: 87, tags: ['new'],
      colors: [{ name: 'Rosa', hex: '#F2B5B0' }, { name: 'Negro', hex: '#222' }, { name: 'Salvia', hex: '#A7BFA4' }],
      sizes: ['XS', 'S', 'M', 'L', 'XL'], image: img('photo-1571731956672-f2b94d7dd0cb')
    },
    {
      id: 'enterizo-riviera', name: 'Enterizo Riviera Escote Profundo', audience: 'mujer', line: 'swimwear',
      price: 54, compareAt: 68, rating: 4.8, reviews: 63, tags: ['sale'],
      colors: [{ name: 'Negro', hex: '#222' }, { name: 'Esmeralda', hex: '#2F7D6A' }],
      sizes: ['S', 'M', 'L', 'XL'], image: img('photo-1582639590011-f5a8416d1101')
    },
    {
      id: 'trikini-isla', name: 'Trikini Isla Cut-Out', audience: 'mujer', line: 'swimwear',
      price: 46, rating: 4.6, reviews: 41, tags: ['new'],
      colors: [{ name: 'Coral', hex: '#E58C80' }, { name: 'Azul', hex: '#5C8DC9' }],
      sizes: ['XS', 'S', 'M', 'L'], image: img('photo-1515886657613-9f3515b0c78f')
    },
    {
      id: 'short-power', name: 'Short Biker Power', audience: 'mujer', line: 'fitness',
      price: 22, compareAt: 28, rating: 4.7, reviews: 132, tags: ['sale', 'bestseller'],
      colors: [{ name: 'Negro', hex: '#222' }, { name: 'Moca', hex: '#8B6B5C' }, { name: 'Coral', hex: '#E58C80' }],
      sizes: ['XS', 'S', 'M', 'L', 'XL'], image: img('photo-1594381898411-846e7d193883')
    },
    {
      id: 'pareo-brisa', name: 'Salida de Playa Brisa', audience: 'mujer', line: 'swimwear',
      price: 29, rating: 4.5, reviews: 28, tags: [],
      colors: [{ name: 'Arena', hex: '#E2CFB6' }, { name: 'Blanco', hex: '#F4F1EC' }],
      sizes: ['S/M', 'L/XL'], image: img('photo-1519046904884-53103b34b206')
    },
    {
      id: 'tee-dry', name: 'Camiseta Dry-Fit Pulse', audience: 'hombre', line: 'fitness',
      price: 26, rating: 4.6, reviews: 54, tags: ['new'],
      colors: [{ name: 'Gris', hex: '#8A8F94' }, { name: 'Negro', hex: '#222' }, { name: 'Azul', hex: '#34506E' }],
      sizes: ['S', 'M', 'L', 'XL'], image: img('photo-1517836357463-d25dfeac3438')
    },
    {
      id: 'short-bano', name: 'Short de Baño Costa', audience: 'hombre', line: 'swimwear',
      price: 32, compareAt: 39, rating: 4.7, reviews: 47, tags: ['sale'],
      colors: [{ name: 'Marino', hex: '#24364F' }, { name: 'Menta', hex: '#9ED8C3' }],
      sizes: ['S', 'M', 'L', 'XL'], image: img('photo-1507525428034-b723cf961d3e')
    },
    {
      id: 'kids-uv', name: 'Licra UV Niños Splash', audience: 'ninos', line: 'swimwear',
      price: 24, rating: 4.9, reviews: 36, tags: ['bestseller'],
      colors: [{ name: 'Celeste', hex: '#8EC9E8' }, { name: 'Rosa', hex: '#F2B5B0' }],
      sizes: ['4', '6', '8', '10', '12'], image: img('photo-1544367567-0f2fcb009e0b')
    },
    {
      id: 'kids-set', name: 'Conjunto Mini Active', audience: 'ninos', line: 'fitness',
      price: 28, rating: 4.8, reviews: 22, tags: ['new'],
      colors: [{ name: 'Lila', hex: '#BBA6D9' }, { name: 'Menta', hex: '#9ED8C3' }],
      sizes: ['4', '6', '8', '10', '12'], image: img('photo-1571019613454-1cb2f99b2d8b')
    }
  ];

  /** Devuelve un producto por id (o null). */
  Nanis.productById = (id) => Nanis.products.find((p) => p.id === id) || null;
})();
