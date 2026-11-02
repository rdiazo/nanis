# Nani's | Fitness & Swimwear — Landing + Carrito

Landing page responsiva (mobile-first) con catálogo filtrable, carrito funcional
persistente, cupones, modo claro/oscuro y checkout por WhatsApp.
HTML5 + CSS3 (custom properties) + JavaScript vanilla. **Sin build step**:
abre `index.html` con doble clic y funciona.

## Estructura

```
nanis/
├── index.html               # Maquetación semántica (todas las secciones)
├── css/
│   ├── tokens.css           # Design tokens: colores (claro/oscuro), tipografía, espaciado
│   ├── base.css             # Reset, tipografía base, utilidades, botones
│   ├── layout.css           # Header, hero, secciones, footer
│   └── components.css       # Tarjetas de producto, filtros, carrito, toast, FAQ
├── js/
│   ├── config.js            # ⚙️ Ajustes de la tienda (WhatsApp, envío, cupones, redes)
│   ├── data/products.js     # 🛍️ Catálogo (reemplazable por una API)
│   ├── utils.js             # Helpers: formato de precio, storage seguro, iconos, estrellas
│   ├── cart.js              # 🧠 Lógica del carrito (sin DOM): añadir, quitar, totales, cupones
│   ├── theme.js             # Modo claro/oscuro
│   ├── ui/toast.js          # Notificaciones
│   ├── ui/header.js         # Menú móvil, buscador, header sticky
│   ├── ui/catalog.js        # Render del grid, filtros, orden, búsqueda
│   ├── ui/cart-drawer.js    # Render del carrito + checkout
│   └── main.js              # Punto de entrada: inicializa todo
└── docs/WIREFRAME.md        # Wireframe + decisiones de diseño/CRO
```

Todos los módulos cuelgan de un único namespace `window.Nanis`, así funciona
también desde `file://` (los ES modules requieren servidor). Si más adelante
migras a Vite/Next, cada archivo ya es un módulo natural: cambia
`Nanis.x = ...` por `export`.

## Lo primero que debes editar

1. **`js/config.js`** → número real de WhatsApp, email, horarios, umbral de envío
   gratis, costo de envío y cupones.
2. **`js/data/products.js`** → productos reales, precios y fotos propias
   (las actuales son de Unsplash, de muestra).
3. **Testimonios y cifras del hero** en `index.html` (marcados con `TODO`) →
   reemplázalos por reseñas reales de clientas.

## Cupones de prueba

| Código | Efecto |
|---|---|
| `BIENVENIDA10` | 10% de descuento |
| `NANIS15` | 15% en compras desde $80 |
| `ENVIOGRATIS` | Envío gratis |

## Escalar

- **Catálogo desde API**: sustituye `Nanis.products` por un `fetch()` en `main.js`
  y llama a `Nanis.catalog.init()` cuando lleguen los datos.
- **Pasarela de pago**: toda la salida a pago está en `checkout()` dentro de
  `js/ui/cart-drawer.js`.
- **Nuevo filtro**: añade la propiedad en `products.js`, el control en
  `index.html` y la condición en `matches()` de `js/ui/catalog.js`.
- **Colores de marca**: solo `css/tokens.css`.
