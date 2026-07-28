# 🎁 Velvet & Vine - Gift Shop Frontend

> Una experiencia de e-commerce premium construida con Angular 22 y SCSS modular

![Angular](https://img.shields.io/badge/Angular-22.0-DD0031?logo=angular)
![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6?logo=typescript)
![SCSS](https://img.shields.io/badge/SCSS-Architecture-CC6699?logo=sass)
![pnpm](https://img.shields.io/badge/pnpm-11.17-F69220?logo=pnpm)

---

## 🚀 Inicio Rápido

```bash
# 1. Instalar dependencias
pnpm install

# 2. Iniciar servidor de desarrollo
pnpm start

# 3. Abrir navegador en http://localhost:4200
```

---

## 📚 Documentación Importante

### 🎨 [Guía de Estilos SCSS](./GUIA_ESTILOS_SCSS.md) - **LECTURA OBLIGATORIA**
Guía completa del sistema de diseño:
- Design tokens y variables
- Mixins y funciones disponibles
- Componentes predefinidos (botones, cards, forms)
- Mejores prácticas y ejemplos

### 💼 [Ejemplos de Uso en Componentes](./EJEMPLOS_USO_COMPONENTES.md)
Ejemplos prácticos de integración:
- Product cards completos
- Hero sections
- Formularios con validación
- Páginas completas

### ⚖️ [SCSS vs Tailwind - Decisión](./SCSS_VS_TAILWIND_DECISION.md)
Análisis técnico de por qué elegimos SCSS sobre Tailwind para este proyecto.

---

## ✨ Características Principales

🎨 **Sistema de Diseño Modular** - SCSS con Design Tokens y BEM  
🧩 **Componentes Reutilizables** - 50+ componentes UI predefinidos  
📱 **Responsive Design** - Mobile-first con breakpoints optimizados  
⚡ **Performance** - Bundle optimizado < 250KB gzipped  
🎭 **Animaciones Elegantes** - 15+ animaciones y transiciones  
🔒 **Type-Safe** - TypeScript estricto  
🎯 **Standalone Components** - Angular moderna sin NgModules  

---

## 📁 Estructura del Proyecto

```
frontend/
├── src/
│   ├── app/                    # Código de la aplicación
│   ├── styles/                 # ⭐ Sistema de diseño SCSS
│   │   ├── abstracts/          # Variables, funciones, mixins
│   │   ├── base/               # Reset, tipografía, animaciones
│   │   ├── components/         # Botones, cards, forms
│   │   ├── layout/             # Header, footer
│   │   └── utilities/          # Clases utilitarias
│   ├── assets/                 # Imágenes, iconos, fonts
│   └── styles.scss             # Punto de entrada principal
│
├── GUIA_ESTILOS_SCSS.md       # 📖 Guía principal
├── EJEMPLOS_USO_COMPONENTES.md # 💡 Ejemplos prácticos
└── SCSS_VS_TAILWIND_DECISION.md # 🤔 Decisión técnica
```

---

## 🛠️ Scripts Disponibles

```bash
# Desarrollo
pnpm start          # Servidor de desarrollo
pnpm build          # Build de producción
pnpm watch          # Build con watch mode

# Testing
pnpm test           # Ejecutar tests

# Code Quality
pnpm lint           # ESLint
pnpm format         # Prettier
```

---

## 🎨 Sistema de Diseño SCSS

### ¿Por qué SCSS y no Tailwind?

Para este proyecto elegimos SCSS porque:

✅ **Diseño altamente personalizado** - Identidad visual única de "Velvet & Vine"  
✅ **HTML limpio y semántico** - BEM sobre clases utilitarias  
✅ **Componentes complejos** - Product cards con overlays y animaciones  
✅ **Mantenibilidad** - Código más legible para equipos pequeños  
✅ **Flexibilidad total** - Control fino de animaciones y estilos  

### Quick Start - Usando los Estilos

**Opción 1: Clases Predefinidas (Recomendado)**

```html
<div class="product-card">
  <div class="product-card__image-wrapper">
    <img class="product-card__image" src="..." />
  </div>
  <div class="product-card__content">
    <h3 class="product-card__title">Rose Bouquet</h3>
    <button class="btn-add-to-cart">Add to Cart</button>
  </div>
</div>
```

**Opción 2: Estilos Custom**

```scss
@use '../../styles/abstracts' as *;

.my-component {
  @include flex-between;
  padding: $spacing-6;
  background: $color-primary-50;
  
  @include respond-to(md) {
    padding: $spacing-8;
  }
}
```

### Design Tokens Principales

```scss
// Colores
$color-primary-700: #b02545;  // Burgundy principal
$color-rose-50: #fff1f2;      // Background suave

// Espaciados (escala 4px)
$spacing-4: 1rem;    // 16px
$spacing-6: 1.5rem;  // 24px
$spacing-8: 2rem;    // 32px

// Breakpoints (Mobile First)
$breakpoint-md: 768px;   // Tablets
$breakpoint-lg: 1024px;  // Laptops
```

---

## 🧩 Componentes Disponibles

### Botones
- `btn-primary` - Botón principal
- `btn-secondary` - Botón secundario
- `btn-ghost` - Botón transparente
- `btn-add-to-cart` - Botón especial con animación
- `btn-wishlist` - Botón de wishlist
- Tamaños: `btn-sm`, `btn-lg`, `btn-xl`

### Cards
- `product-card` - Card de producto completo
- `featured-card` - Card destacado horizontal
- `collection-card` - Card de colección
- `testimonial-card` - Card de testimonio

### Formularios
- `form-input` - Input base
- `form-select` - Select personalizado
- `form-checkbox` - Checkbox custom
- `form-radio` - Radio button custom
- `form-switch` - Toggle switch
- `search-input` - Input de búsqueda

### Layout
- `header` - Encabezado con navegación
- `footer` - Pie de página
- `container` - Contenedor responsive

### Utilidades
- Spacing: `mt-6`, `px-4`, `gap-8`
- Display: `d-flex`, `justify-between`, `items-center`
- Animaciones: `animate-fade-in`, `hover-lift`

**Ver todos los componentes en:** [GUIA_ESTILOS_SCSS.md](./GUIA_ESTILOS_SCSS.md)

---

## 📱 Responsive Design

Mobile First approach con breakpoints:

```scss
.element {
  padding: $spacing-4;        // Mobile (default)
  
  @include respond-to(md) {   // >= 768px (Tablets)
    padding: $spacing-6;
  }
  
  @include respond-to(lg) {   // >= 1024px (Laptops)
    padding: $spacing-8;
  }
}
```

---

## 🎭 Animaciones

15+ animaciones predefinidas:

```html
<div class="animate-fade-in">Fade in</div>
<div class="animate-slide-up">Slide up</div>
<div class="hover-lift">Se eleva al hover</div>

<!-- Skeleton loading -->
<div class="skeleton" style="height: 200px;"></div>

<!-- Spinner -->
<span class="spinner"></span>
```

---

## 📦 Stack Tecnológico

- **Angular 22.0** - Framework principal
- **TypeScript 6.0** - Type safety
- **SCSS** - Preprocesador CSS con arquitectura ITCSS
- **RxJS 7.8** - Reactive programming
- **pnpm** - Package manager
- **Vitest** - Testing framework

---

## 🚀 Build de Producción

```bash
pnpm build

# Output optimizado en: dist/
# Optimizaciones automáticas:
# - Tree shaking
# - Minification
# - CSS purge (solo estilos usados)
# - Code splitting
# - Lazy loading
```

**Bundle size estimado:**
- Initial: ~200KB gzipped
- SCSS: ~30KB gzipped
- **Total: ~230KB gzipped**

---

## 🔧 Configuración

### Angular
- Versión: 22.0
- Build system: esbuild
- Style preprocessor: SCSS
- Signals: Habilitado

### TypeScript
- Modo estricto habilitado
- Target: ES2022
- Module: ES2022

### SCSS
- Architecture: ITCSS + BEM
- Module system: Sass @use/@forward
- Purge: Habilitado en producción

---

## 💡 Tips y Mejores Prácticas

### 1. Usa clases predefinidas siempre que sea posible

```html
<!-- ✅ BIEN -->
<button class="btn-primary btn-lg">Click me</button>

<!-- ❌ EVITAR -->
<button class="my-custom-button">Click me</button>
```

### 2. Importa solo abstracts en componentes

```scss
// ✅ BIEN
@use '../../styles/abstracts' as *;

// ❌ MAL - Los componentes ya están globales
@use '../../styles/components/buttons';
```

### 3. Mobile First siempre

```scss
// ✅ BIEN
.element {
  font-size: $font-size-sm;    // Mobile
  
  @include respond-to(md) {
    font-size: $font-size-base; // Tablet+
  }
}

// ❌ MAL (Desktop first)
@media (max-width: 768px) { ... }
```

### 4. Usa Design Tokens, no valores hardcodeados

```scss
// ✅ BIEN
color: $color-text-primary;
padding: $spacing-6;

// ❌ MAL
color: #171717;
padding: 24px;
```

---

## 🐛 Troubleshooting

**Estilos no se aplican:**
```scss
// Asegúrate de importar abstracts correctamente
@use '../../styles/abstracts' as *;
```

**Hot reload no funciona:**
```bash
# Reiniciar el servidor
pnpm start
```

**Error de módulos:**
```bash
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

---

## 📖 Recursos Adicionales

- [Angular Docs](https://angular.dev)
- [SCSS Documentation](https://sass-lang.com/documentation)
- [BEM Methodology](http://getbem.com/)
- [ITCSS Architecture](https://www.xfive.co/blog/itcss-scalable-maintainable-css-architecture/)

---

## 🤝 Contribuir

### Nomenclatura

**Componentes Angular:**
```typescript
export class ProductCardComponent { }  // ✅
export class productCard { }           // ❌
```

**Estilos BEM:**
```scss
.product-card { }           // ✅ Block
.product-card__title { }    // ✅ Element
.product-card--featured { } // ✅ Modifier
```

**Commits:**
```bash
feat: add product card component
fix: resolve hover animation bug
docs: update style guide
```

---

## 📝 TODO

- [ ] Implementar páginas principales
- [ ] Integrar con API backend
- [ ] State management (Signals)
- [ ] Checkout flow
- [ ] Tests e2e
- [ ] Storybook
- [ ] i18n
- [ ] PWA

---

**¿Preguntas?** Lee primero la [Guía de Estilos SCSS](./GUIA_ESTILOS_SCSS.md) 📖

**¡Happy coding! 🚀**
