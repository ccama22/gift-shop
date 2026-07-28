# 🔐 Auth Feature Module

## Estructura de Carpetas

```
auth/
├── pages/              # Smart components (páginas completas)
│   ├── login/
│   │   ├── login.component.ts
│   │   ├── login.component.html
│   │   └── login.component.scss
│   └── register/
│       ├── register.component.ts
│       ├── register.component.html
│       └── register.component.scss
├── components/         # Presentational components (reutilizables)
│   └── (futuros componentes compartidos)
├── services/          # Servicios de autenticación
│   └── (auth.service.ts, token.service.ts, etc.)
├── guards/            # Route guards
│   └── (auth.guard.ts, etc.)
├── models/            # Interfaces y tipos
│   └── (user.model.ts, auth.model.ts, etc.)
└── README.md          # Este archivo

```

## Patrones Utilizados

### 1. **Feature-based Structure**
- Cada feature (auth, products, checkout) tiene su propia carpeta
- Facilita el lazy loading y la escalabilidad
- Mejor organización del código

### 2. **Smart & Presentational Components**
- **Pages (Smart)**: Manejan lógica, estado y routing
- **Components (Presentational)**: Solo presentan datos, son reutilizables

### 3. **Standalone Components**
- Todos los componentes son standalone (Angular 17+)
- No se requieren módulos NgModule
- Lazy loading optimizado

### 4. **Signals API**
- Uso de signals para estado reactivo
- Mejor rendimiento que observables en casos simples
- Código más limpio y fácil de leer

## Características Implementadas

### Login Page (`/auth/login`)
- ✅ Form con validación
- ✅ Toggle password visibility
- ✅ Remember me checkbox
- ✅ Forgot password link
- ✅ Social login (Google, Facebook)
- ✅ Error handling con mensajes claros
- ✅ Loading states
- ✅ Responsive design

### Register Page (`/auth/register`)
- ✅ Form multi-campo con validación
- ✅ Password strength indicator
- ✅ Confirm password validation
- ✅ Terms & conditions checkbox
- ✅ Social registration
- ✅ Error handling
- ✅ Loading states
- ✅ Responsive design

## Próximos Pasos

### Servicios a Implementar
```typescript
// auth/services/auth.service.ts
- login(email, password)
- register(userData)
- logout()
- refreshToken()
- getCurrentUser()

// auth/services/token.service.ts
- saveToken()
- getToken()
- removeToken()
- decodeToken()
```

### Guards a Implementar
```typescript
// auth/guards/auth.guard.ts
- canActivate() - Proteger rutas privadas
- canLoad() - Lazy loading condicional

// auth/guards/guest.guard.ts
- canActivate() - Redirigir usuarios logueados
```

### Interceptors
```typescript
// auth/interceptors/auth.interceptor.ts
- Agregar token a requests
- Refresh token automático
- Manejar errores 401/403
```

## Estilo y UX

### Diseño
- Layout split-screen con imagen
- Card centrado y responsive
- Tabs para alternar entre login/register
- Campos con iconos y feedback visual
- Colores de marca consistentes

### Validaciones
- Email format validation
- Password strength (min 8 chars)
- Password match confirmation
- Required fields
- Real-time feedback

### Estados
- Loading states con spinner
- Error messages contextuales
- Success feedback
- Disabled states durante loading

## Uso

### Navegación
```typescript
// Navegar a login
this.router.navigate(['/auth/login']);

// Navegar a register
this.router.navigate(['/auth/register']);
```

### Rutas Configuradas
```
/auth/login     → LoginComponent
/auth/register  → RegisterComponent
/auth           → Redirect a /auth/login
```

## Mejores Prácticas Aplicadas

1. ✅ **Separation of Concerns**: Lógica separada de presentación
2. ✅ **Mobile-First**: Diseño responsive desde mobile
3. ✅ **Accessibility**: Labels, ARIA attributes, keyboard navigation
4. ✅ **Type Safety**: TypeScript estricto con interfaces
5. ✅ **DRY**: Estilos compartidos en `_auth.scss`
6. ✅ **Performance**: Lazy loading, signals, OnPush strategy ready
7. ✅ **Security**: Password hidden por defecto, validaciones
8. ✅ **UX**: Loading states, error handling, clear feedback

## Integración con Backend

Para conectar con tu backend NestJS:

```typescript
// auth/services/auth.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/auth';

  login(email: string, password: string) {
    return this.http.post(`${this.apiUrl}/login`, { email, password });
  }

  register(userData: RegisterDto) {
    return this.http.post(`${this.apiUrl}/register`, userData);
  }
}
```

## Testing

Estructura recomendada para tests:
```
auth/
├── pages/
│   ├── login/
│   │   ├── login.component.spec.ts
│   │   └── login.component.ts
│   └── register/
│       ├── register.component.spec.ts
│       └── register.component.ts
└── services/
    └── auth.service.spec.ts
```
