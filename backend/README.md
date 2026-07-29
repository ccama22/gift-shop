# 🎁 Gift Shop - Backend

API REST para gestión de tienda de regalos construida con **NestJS**, **TypeORM** y **PostgreSQL** siguiendo **Clean Architecture**.

## 🏗️ Arquitectura

**Patrón**: Clean Architecture (Hexagonal Architecture)

```
src/
├── domain/                      # Capa de Dominio (Entidades y Reglas de Negocio)
│   ├── entities/               # Product, Category, ProductImage, Tag
│   ├── value-objects/          # Money, Sku, StockLevel
│   ├── enums/                  # ProductCategory, StockStatus
│   └── exceptions/             # Custom domain exceptions
│
├── application/                 # Capa de Aplicación (Casos de Uso)
│   ├── use-cases/              # CreateProduct, UpdateProduct, DeleteProduct
│   ├── dto/                    # Request/Response DTOs
│   └── ports/                  # Interfaces (ProductRepository, FileStorage)
│
├── infrastructure/              # Capa de Infraestructura (Implementaciones)
│   ├── persistence/
│   │   └── typeorm/           # Implementación con TypeORM
│   │       ├── entities/      # Entidades TypeORM (mapeo DB)
│   │       ├── repositories/  # Implementación de ports
│   │       ├── migrations/    # Migraciones de DB
│   │       └── seeders/       # Datos iniciales
│   ├── file-upload/           # Manejo de archivos (Multer)
│   └── security/              # Seguridad (Helmet, Throttler)
│
├── presentation/                # Capa de Presentación (Controllers/API)
│   └── http/
│       └── controllers/       # ProductController, CategoryController
│
├── auth/                        # Módulo de Autenticación (JWT + Refresh Tokens)
│   ├── entities/              # User, Session
│   ├── dto/                   # LoginDto, RegisterDto, AuthResponseDto
│   ├── jwt.strategy.ts        # Estrategia Passport JWT
│   └── jwt-auth.guard.ts      # Guard de protección
│
└── config/                      # Configuración global
    └── database.config.ts     # Conexión TypeORM
```

**Principios aplicados**:
- ✅ **SOLID** (Single Responsibility, Open/Closed, Liskov, Interface Segregation, Dependency Inversion)
- ✅ **Dependency Injection** (IoC con NestJS)
- ✅ **Repository Pattern** (abstracción de persistencia)
- ✅ **DTO Pattern** (separación de capas)
- ✅ **Value Objects** (encapsulación de lógica de negocio)

**Stack Técnico**:
- NestJS (framework Node.js)
- TypeORM (ORM para PostgreSQL)
- PostgreSQL (base de datos)
- Passport JWT (autenticación)
- Class Validator + Class Transformer (validación)
- Multer (subida de archivos)
- Helmet + Throttler (seguridad)

## 🚀 Instalación y Ejecución

### Prerequisitos
- Node.js 18+
- PostgreSQL 14+
- pnpm (o npm)

### Pasos

```bash
# 1. Instalar dependencias
pnpm install

# 2. Crear base de datos
# Opción A: Ejecutar script SQL manualmente
psql -U postgres -f create-database.sql

# Opción B: Usar script automatizado
pnpm run db:create

# 3. Configurar variables de entorno
# Copiar .env.example a .env y editar
cp .env.example .env

# 4. Ejecutar migraciones
pnpm run migration:run

# 5. (Opcional) Insertar datos de prueba
pnpm run seed:run

# 6. Iniciar servidor de desarrollo
pnpm run start:dev
# Disponible en http://localhost:3000
```

## ⚙️ Variables de Entorno (.env)

Crea un archivo `.env` en la raíz del proyecto con estas variables:

```env
# Entorno de la aplicación
NODE_ENV=development
PORT=3000

# Configuración de Base de Datos PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=tu_password_seguro
DB_NAME=gift_shop_db

# Configuración de JWT (JSON Web Tokens)
# IMPORTANTE: En producción, genera secretos seguros con:
# node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Secret para firmar tokens (OBLIGATORIO)
# Debe tener al menos 64 caracteres aleatorios
JWT_ACCESS_TOKEN_SECRET=cambia_este_secreto_por_uno_seguro_generado_aleatoriamente_de_64_bytes_minimo

# Tiempos de expiración
JWT_ACCESS_TOKEN_EXPIRES_IN=900        # 15 minutos (en segundos)
JWT_REFRESH_TOKEN_EXPIRES_IN=604800    # 7 días (en segundos)
```

### 🔒 Generar Secretos Seguros

Para producción, genera secretos criptográficamente seguros:

```bash
# Generar un secreto aleatorio de 64 bytes
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Copia el resultado y úsalo en `JWT_ACCESS_TOKEN_SECRET`.

## 📝 Comandos Principales

```bash
# Desarrollo
pnpm run start:dev          # Servidor con hot-reload
pnpm run start:debug        # Servidor con debugging

# Build
pnpm run build              # Compilar para producción
pnpm run start:prod         # Ejecutar build de producción

# Migraciones de Base de Datos
pnpm run migration:generate <MigrationName>  # Generar migración automática
pnpm run migration:create <MigrationName>    # Crear migración vacía
pnpm run migration:run                       # Ejecutar migraciones pendientes
pnpm run migration:revert                    # Revertir última migración
pnpm run migration:show                      # Ver estado de migraciones

# Seeders (Datos de Prueba)
pnpm run seed:run           # Insertar datos iniciales
pnpm run db:reset           # Resetear DB + migrar + seed

# Testing
pnpm run test               # Ejecutar tests unitarios
pnpm run test:watch         # Tests en modo watch
pnpm run test:cov           # Generar reporte de cobertura
pnpm run test:e2e           # Tests end-to-end

# Calidad de Código
pnpm run lint               # Verificar código con ESLint
pnpm run format             # Formatear con Prettier
```

## � Endpoints Principales

### Autenticación
- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/login` - Iniciar sesión (devuelve access + refresh tokens)
- `POST /api/auth/refresh` - Renovar access token
- `POST /api/auth/logout` - Cerrar sesión (invalida refresh token)

### Productos (requieren autenticación)
- `GET /api/products` - Listar productos
- `GET /api/products/:id` - Obtener detalle de producto
- `POST /api/products` - Crear producto (con imágenes)
- `PATCH /api/products/:id` - Actualizar producto
- `DELETE /api/products/:id` - Eliminar producto (soft delete)

### Categorías
- `GET /api/categories` - Listar categorías

### Imágenes
- `GET /uploads/:filename` - Obtener imagen
- `DELETE /api/products/:id/images/:imageId` - Eliminar imagen

## 🔐 Autenticación JWT

El sistema usa **doble token**:

1. **Access Token**: Corta duración (15 min), se envía en cada request
2. **Refresh Token**: Larga duración (7 días), permite renovar access token

### Flujo de autenticación
```
1. Login → Devuelve { accessToken, refreshToken, user }
2. Cliente guarda ambos tokens
3. Cada request lleva: Authorization: Bearer <accessToken>
4. Si access token expira → llamar a /auth/refresh con refreshToken
5. Logout → invalida refresh token en DB
```

### Headers requeridos
```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## �️ Base de Datos

### Diagrama de Entidades

```
User
├── id (PK)
├── email (unique)
├── password (hashed)
├── fullName
└── createdAt

Session (Refresh Tokens)
├── id (PK)
├── userId (FK → User)
├── refreshToken (hashed)
├── expiresAt
└── createdAt

Product
├── id (PK)
├── name
├── sku (unique)
├── description
├── price (decimal)
├── stock
├── category (enum)
├── isActive
├── lowStockAlert
├── tags (array)
├── images (1:N → ProductImage)
└── timestamps (created, updated, deleted)

ProductImage
├── id (PK)
├── productId (FK → Product)
├── filename
├── path
├── isPrimary
└── createdAt
```

### Migraciones

Las migraciones están en `src/infrastructure/persistence/typeorm/migrations/`

Para crear una nueva:
```bash
# Genera automáticamente basándose en cambios de entidades
pnpm run migration:generate src/infrastructure/persistence/typeorm/migrations/AddNewColumn

# O crea una vacía para escribir manualmente
pnpm run migration:create src/infrastructure/persistence/typeorm/migrations/CustomMigration
```

## 🛡️ Seguridad

- ✅ **Helmet**: Headers de seguridad HTTP
- ✅ **Throttler**: Rate limiting (10 req/min por IP)
- ✅ **CORS**: Configurado para frontend específico
- ✅ **Bcrypt**: Hash de contraseñas (10 salt rounds)
- ✅ **JWT**: Tokens firmados con secreto
- ✅ **Validación**: Class Validator en todos los DTOs
- ✅ **Soft Delete**: No se borran registros físicamente

## � Gestión de Archivos

Las imágenes se guardan en `uploads/` con:
- Nombre único (UUID + timestamp)
- Validación de tipo (jpg, jpeg, png, webp)
- Límite de tamaño (5MB por imagen)

**Nota**: En producción, considera usar S3 o similar en lugar de almacenamiento local.

## 🐛 Troubleshooting

### Error: Database connection failed
```bash
# Verifica que PostgreSQL esté corriendo
# Windows:
net start postgresql-x64-14

# Verifica credenciales en .env
```

### Error: JWT must be provided
```bash
# Asegúrate de:
# 1. Estar logueado (tener accessToken)
# 2. Incluir header: Authorization: Bearer <token>
```

### Error: Migrations failed
```bash
# Resetea la base de datos (¡cuidado! borra datos)
pnpm run migration:revert
pnpm run migration:run
```

### Puerto 3000 en uso
```bash
# Cambia el puerto en .env
PORT=3001
```

## 📚 Recursos

- [NestJS Documentation](https://docs.nestjs.com/)
- [TypeORM Migrations Guide](https://typeorm.io/migrations)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)

---

**Desarrollado con NestJS + Clean Architecture + PostgreSQL**
