# 🎨 Gift Shop - Frontend

Aplicación web moderna para tienda de regalos construida con **Angular 18**, **Signals** y diseño **Mobile-First**.

## 🏗️ Arquitectura

**Patrón**: Feature-Based Modular Architecture

```
src/app/
├── core/                    # Servicios singleton y configuración global
│   ├── guards/             # AuthGuard (protección de rutas)
│   ├── interceptors/       # AuthInterceptor (inyección de JWT)
│   ├── services/           # AuthService, ProductService, DialogService
│   └── models/             # Interfaces y tipos globales
│
├── features/               # Módulos por funcionalidad (standalone)
│   ├── auth/              # Login, Register
│   ├── admin/             # CRUD Productos, Inventario
│   └── home/              # Catálogo público, Filtros
│
├── shared/                 # Componentes reutilizables
│   └── components/        # Modals, Drawers, Botones
│
└── styles/                 # SCSS modular (variables, mixins, components)
```

**Stack Técnico**:
- Angular 18 Standalone Components
- Signals (estado reactivo)
- RxJS (operaciones asíncronas)
- SCSS (preprocesador CSS)
- TypeScript (tipado estático)

## 🚀 Instalación y Ejecución

```bash
# 1. Instalar dependencias
npm install

# 2. Iniciar servidor de desarrollo
npm start
# Disponible en http://localhost:4200
```

## ⚙️ Variables de Entorno

**`src/environments/environment.ts`** (desarrollo)
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
  serverUrl: 'http://localhost:3000'
};
```

**`src/environments/environment.prod.ts`** (producción)
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://tu-api.com/api',
  serverUrl: 'https://tu-api.com'
};
```

## 📝 Comandos Principales

```bash
# Desarrollo
npm start              # Servidor con hot-reload

# Build
npm run build          # Build de producción optimizado

# Testing
npm run test           # Ejecuta tests unitarios
npm run test:coverage  # Genera reporte de cobertura

# Calidad de Código
npm run lint           # Verifica código
npm run lint:fix       # Corrige errores automáticamente
npm run format         # Formatea con Prettier
```

## � Características Principales

- ✅ **Autenticación**: Login/Register con JWT + Refresh Tokens
- ✅ **Admin Panel**: CRUD completo de productos con imágenes
- ✅ **Catálogo Público**: Grid responsive con filtros y búsqueda
- ✅ **Gestión de Imágenes**: Subida múltiple con preview
- ✅ **Responsive**: Mobile-First (320px - 1920px+)
- ✅ **UX Avanzada**: Modals, drawers, loading states, confirmaciones

## 🎨 Sistema de Diseño

**Colores**: Burgundy/Wine (primario), Rose/Pink (acentos)  
**Tipografía**: Inter (UI), Playfair Display (títulos)  
**Breakpoints**: 640px (sm), 768px (md), 1024px (lg), 1280px (xl)

---

**Desarrollado con Angular 18 + Signals**
