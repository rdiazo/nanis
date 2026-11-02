# Nani's | Fitness & Swimwear — Wireframe y decisiones de diseño

> Enfoque **mobile-first**: cada bloque se diseña primero para 360–420 px y se
> expande en `min-width: 640px` (tablet) y `min-width: 1024px` (desktop).

---

## 1. Layout general

```
┌──────────────────────────────────────────────────────────────┐
│ BARRA DE ANUNCIO  "Envío GRATIS desde $60 · Cupón BIENVENIDA10" │
├──────────────────────────────────────────────────────────────┤
│ HEADER (sticky)                                              │
│ [☰] NANI'S        Mujer Hombre Niños Deporte Outlet   🔍 ◐ IG TT 🛒(2) │
│ └─ Barra de búsqueda desplegable (filtra el catálogo en vivo)│
├──────────────────────────────────────────────────────────────┤
│ HERO (imagen a sangre + overlay)                             │
│   Nueva colección · Verano 2026                              │
│   ENTRENA CON ESTILO, LUCE INCREÍBLE.                        │
│   Subtítulo comodidad + estilo                               │
│   [ Ver Colección ]  [ Swimwear → ]                          │
│   ★ 4.9 valoración · Envíos a todo el país                   │
├──────────────────────────────────────────────────────────────┤
│ CATEGORÍAS DESTACADAS                                        │
│ ┌────────────── Fitness ─────────┐ ┌──────── Swimwear ──────┐│
│ │ imagen + título + "Comprar →"  │ │ imagen + título + CTA  ││
│ └────────────────────────────────┘ └────────────────────────┘│
├──────────────────────────────────────────────────────────────┤
│ CATÁLOGO                                                     │
│ [Todos][Más vendidos][Nuevos][Ofertas]   Línea ▾   Ordenar ▾ │
│ Filtro activo: "Mujer ×"            12 productos             │
│ ┌────┐ ┌────┐ ┌────┐ ┌────┐   ← 2 col móvil / 3 tablet / 4 desktop
│ │img │ │img │ │img │ │img │   Tarjeta: badges, nombre, ★, precio,
│ │... │ │... │ │... │ │... │   colores, tallas, [Añadir al carrito]
│ └────┘ └────┘ └────┘ └────┘                                  │
├──────────────────────────────────────────────────────────────┤
│ BENEFICIOS  🚚 Envíos · 🔒 Pagos seguros · ✨ Calidad · ↺ Cambios │
├──────────────────────────────────────────────────────────────┤
│ TESTIMONIOS (3 tarjetas)                                     │
├──────────────────────────────────────────────────────────────┤
│ COMUNIDAD INSTAGRAM  @cositas_nanis  (mosaico + CTA seguir)  │
├──────────────────────────────────────────────────────────────┤
│ FAQ (acordeón <details>)                                     │
├──────────────────────────────────────────────────────────────┤
│ FOOTER                                                       │
│ Logo + descripción + redes │ Tienda │ Ayuda │ Contacto        │
│ Métodos de pago: VISA · MC · PayPal · Zelle · Transf. · Pago Móvil │
│ © 2026 Nani's                                                │
└──────────────────────────────────────────────────────────────┘

        [ WhatsApp flotante ]  (esquina inferior derecha)

CARRITO (slide-over derecha, 100% ancho en móvil / 420px desktop)
┌───────────────────────────────┐
│ Tu carrito (3)            [×] │
│ ▓▓▓▓▓▓░░░ Te faltan $12 para  │
│           envío GRATIS        │
│ ┌──┐ Legging Sculpt           │
│ │  │ Coral · Talla M          │
│ └──┘ [-] 1 [+]   $38.00   🗑  │
│ ...                           │
│ [ Código de descuento ][Aplicar]│
│ Subtotal            $96.00    │
│ Descuento          −$9.60     │
│ Envío               Gratis    │
│ TOTAL               $86.40    │
│ [ Proceder al Pago ]          │
│ Seguir comprando              │
└───────────────────────────────┘
```

## 2. Mejoras que apliqué sobre el brief (criterio CRO)

| Cambio | Por qué |
|---|---|
| **Barra de anuncio** con umbral de envío gratis y cupón | Es el incentivo #1 para subir el ticket promedio; se ve antes que nada. |
| **Barra de progreso de envío gratis** en el carrito | "Te faltan $X" empuja a añadir un artículo más (sube AOV). |
| **Checkout vía WhatsApp** (mensaje con el pedido armado) | La marca vende por redes y acepta Zelle/transferencias: el cierre real ocurre por chat. El punto de integración está aislado en `js/ui/cart-drawer.js → checkout()` para cambiarlo luego por Stripe/PayPal/Shopify. |
| **Talla obligatoria** antes de añadir | Evita pedidos incompletos y devoluciones. |
| **Toast con acción "Ver carrito"** en lugar de abrir el carrito a la fuerza | No interrumpe la navegación, pero deja el camino a pagar a un clic. |
| **Menú: Mujer / Hombre / Niños = público; Deporte = línea fitness; Outlet = ofertas** | El brief mezcla público y tipo de producto; lo resolví con filtros combinables en vez de páginas separadas. Si el catálogo crece, sugiero menú: *Mujer · Hombre · Niños · Fitness · Swimwear · Outlet*. |
| **FAQ como sección propia antes del footer** | Resuelve objeciones (tallas, pagos, envíos) justo antes de que la persona abandone; dentro del footer pasa desapercibida. |
| **Sección comunidad Instagram** | Prueba social real de la marca y puente a sus redes. |
| **WhatsApp flotante** | Canal de dudas siempre visible = menos abandono. |
| **Carrito persistente** (localStorage) | Si la clienta cierra la pestaña, su carrito sigue ahí. |
| **Modo claro/oscuro** con preferencia del sistema + memoria | Pedido en el brief; sin parpadeo al cargar. |

## 3. Breakpoints

| Rango | Grid productos | Header |
|---|---|---|
| < 640 px | 2 columnas | Hamburguesa + logo + búsqueda + carrito |
| 640–1023 px | 3 columnas | Igual + tema + redes |
| ≥ 1024 px | 4 columnas | Menú horizontal completo |
