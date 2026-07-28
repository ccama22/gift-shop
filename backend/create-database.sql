-- ============================================
-- Script para crear la base de datos
-- ============================================

-- Crear la base de datos (si no existe)
CREATE DATABASE product_management
    WITH 
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'Spanish_Spain.1252'
    LC_CTYPE = 'Spanish_Spain.1252'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1;

-- Conectar a la base de datos
\c product_management

-- Mensaje de confirmación
SELECT 'Base de datos product_management creada exitosamente!' AS mensaje;
