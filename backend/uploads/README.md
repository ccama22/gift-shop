# Uploads Directory

Esta carpeta contiene archivos subidos por usuarios a través de la aplicación.

## Estructura

```
uploads/
└── products/          # Imágenes de productos
    └── [timestamp]-[random].jpg
```

## Configuración

- **Ubicación**: `./uploads/products`
- **Tamaño máximo**: 5 MB por archivo
- **Formatos permitidos**: JPG, JPEG, PNG
- **Nombres de archivo**: `[timestamp]-[random].[ext]`

## Git

Esta carpeta está **ignorada por Git** (ver `.gitignore`) para evitar:
- Aumentar el tamaño del repositorio
- Subir datos de usuarios al control de versiones
- Conflictos con archivos binarios

Solo se mantiene en el repositorio:
- `.gitkeep` - Mantiene la estructura de carpetas
- `README.md` - Esta documentación

## Producción

En producción, se recomienda:
1. **Usar un servicio de almacenamiento externo**: AWS S3, Cloudinary, etc.
2. **CDN**: Para servir las imágenes más rápido
3. **Backup**: Hacer respaldo regular de esta carpeta
4. **Permisos**: Configurar permisos apropiados en el servidor

## Desarrollo Local

Las imágenes se sirven estáticamente en: `http://localhost:3000/uploads/products/[filename]`

Ver configuración en:
- `src/main.ts` - Configuración de archivos estáticos
- `src/infrastructure/file-upload/multer.config.ts` - Configuración de uploads
