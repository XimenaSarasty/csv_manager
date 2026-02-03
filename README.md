# 📁 CSV Manager - Prueba Técnica Full Stack

Sistema de gestión de documentos CSV con autenticación, verificación de email, roles de usuario y validación de datos.

## ✨ Características Principales

- ✅ **Autenticación Segura:** JWT con httpOnly cookies
- ✅ **Verificación de Email:** Sistema completo con tokens de 24 horas
- ✅ **Roles y Permisos:** Control de acceso basado en roles (RBAC)
- ✅ **Validación CSV:** Reglas estrictas con mensajes en español
- ✅ **Migraciones de BD:** Schema personalizado `csv_app` (seguro)
- ✅ **UI Moderna:** Vue 3 + Tailwind CSS con componentes reactivos

## 🚀 Stack Tecnológico

**Backend:**
- Node.js 24.x LTS + Express
- PostgreSQL 15
- Sequelize ORM + Migrations
- JWT Authentication
- Multer + csv-parse

**Frontend:**
- Vue 3 (Options API)
- Tailwind CSS
- Axios
- Vue Router
- Vite

**Infraestructura:**
- Docker & Docker Compose
- Node.js 24 Alpine

## 📋 Requisitos Previos

- Docker & Docker Compose instalados
- pgAdmin u otro cliente PostgreSQL (para crear la base de datos inicial)
- Puertos disponibles: 5432 (PostgreSQL), 3000 (Backend), 5173 (Frontend)

## 🏃 Inicio Rápido

### 1. Crear la Base de Datos (IMPORTANTE)

**Antes de ejecutar docker-compose**, necesitas crear la base de datos manualmente:

**Opción A: Usando pgAdmin**
1. Abre pgAdmin y conéctate a tu servidor PostgreSQL local (o crea uno nuevo)
   - Host: `localhost`
   - Puerto: `5432`
   - Usuario: `postgres`
   - Contraseña: `postgres123` (o la que uses)
2. Click derecho en "Databases" → "Create" → "Database..."
3. Database name: `csv_manager`
4. Owner: `postgres`
5. Click "Save"

**Opción B: Usando línea de comandos**
```bash
# Asegúrate de que PostgreSQL esté corriendo en Docker primero
docker-compose up -d postgres

# Crear la base de datos
docker-compose exec postgres psql -U postgres -c "CREATE DATABASE csv_manager;"
```

### 2. Navega a la carpeta del proyecto
```bash
cd C:\Users\laura\Documents\csv-manager-project
```

### 3. Levantar todo el entorno con Docker
```bash
docker-compose up --build
```

**⚠️ Nota Importante sobre Migraciones:**
- El proyecto usa **Sequelize Migrations** para crear las tablas automáticamente
- Las tablas se crean en el schema `csv_app` (NO en `public`) por seguridad
- Las migraciones se ejecutan automáticamente al iniciar el backend
- Ver detalles en [backend/MIGRATIONS.md](backend/MIGRATIONS.md)

Esto iniciará:
- ✅ PostgreSQL en `localhost:5432`
- ✅ Backend API en `http://localhost:3000` (ejecuta migraciones automáticamente)
- ✅ Frontend en `http://localhost:5173`

### 4. Verificar que las migraciones se ejecutaron correctamente

Puedes verificar los logs del backend:
```bash
docker-compose logs backend
```

Deberías ver algo como:
```
✅ Database connection established successfully.
Sequelize CLI [Node: ...] 
== 20260202000001-create-schema-and-users: migrating =======
== 20260202000001-create-schema-and-users: migrated
...
⚠️  Recuerda ejecutar las migraciones: npm run migrate
🚀 Server running on http://localhost:3000
```

### 5. Acceder a la aplicación
Abre tu navegador en: **http://localhost:5173**

### 6. Probar el Sistema (Flujo Completo)

#### 📝 Paso 1: Registrar un usuario

1. En el navegador, ve a la página de registro
2. Completa el formulario con tus datos:
   - **Email:** tu-email@ejemplo.com (puede ser cualquier email, incluso uno falso)
   - **Nombre:** Tu Nombre
   - **Contraseña:** mínimo 6 caracteres
   - **Rol:** selecciona `user` o `admin`
3. Haz clic en **"Registrarse"**
4. Verás un mensaje: _"Registro exitoso. Revisa tu email para verificar tu cuenta."_

**⚠️ IMPORTANTE:** El email NO llegará a tu bandeja real. El sistema usa **Ethereal** (emails de prueba) para desarrollo.

#### 📧 Paso 2: Obtener el link de verificación

Para ver el email que "se envió", necesitas copiar una URL especial de los logs:

1. Abre PowerShell en la carpeta del proyecto
2. Ejecuta este comando:
   ```powershell
   docker-compose logs backend | Select-String "Preview URL"
   ```

3. Verás algo como esto:
   ```
   📧 Preview URL: https://ethereal.email/message/aYFYLb2PRWtCli93...
   ```

4. **Copia toda esa URL** (desde `https://` hasta el final)

#### 🔍 Paso 3: Ver el email de verificación

1. **Pega la URL** que copiaste en tu navegador
2. Se abrirá una página de Ethereal mostrando el email completo
3. Verás un email y un botón azul que dice **"Verificar mi correo"**
4. **Haz clic en ese botón**

#### ✅ Paso 4: Confirmar la verificación

1. Al hacer clic, te redirigirá automáticamente a la aplicación
2. Verás el mensaje: _"¡Email verificado exitosamente! Ahora puedes iniciar sesión."_
3. Espera 3 segundos y serás redirigido automáticamente al login

#### 🔐 Paso 5: Iniciar sesión

1. Ingresa el **mismo email y contraseña** que usaste al registrarte
2. Haz clic en **"Iniciar sesión"**
3. ✅ ¡Listo! Ahora estás dentro de la aplicación

---

## � Roles de Usuario

Una vez que hayas verificado tu email e iniciado sesión:
- **user**: Puede cargar y descargar documentos CSV
- **admin**: Puede cargar, descargar y **eliminar** documentos CSV

## 📁 Estructura del Proyecto

```
csv-manager/
├── backend/              # API Node.js + Express
│   ├── src/
│   │   ├── config/      # Configuración de BD
│   │   ├── models/      # Modelos Sequelize
│   │   ├── routes/      # Endpoints REST
│   │   ├── middleware/  # Auth & RBAC
│   │   ├── controllers/ # Lógica de negocio
│   │   └── utils/       # Validadores CSV
│   ├── Dockerfile
│   └── package.json
├── frontend/            # Vue 3 App
│   ├── src/
│   │   ├── components/  # Componentes reutilizables
│   │   ├── views/       # Páginas principales
│   │   ├── router/      # Vue Router
│   │   └── services/    # API calls
│   ├── Dockerfile
│   └── package.json
└── docker-compose.yml   # Orquestación completa
```

## 🔌 API Endpoints

### Autenticación
- `POST /api/auth/register` - Registro de usuarios (envía email de verificación)
- `GET /api/auth/verify-email/:token` - Verificar email con token
- `POST /api/auth/login` - Login (retorna JWT en httpOnly cookie)
- `POST /api/auth/logout` - Cerrar sesión (limpia cookie)

### Documentos CSV
- `POST /api/documents/upload` - Cargar CSV (autenticado)
- `GET /api/documents` - Listar documentos (autenticado)
- `GET /api/documents/:id/download` - Descargar CSV (autenticado)
- `DELETE /api/documents/:id` - Eliminar documento (solo admin)

## 📝 Formato CSV Esperado

El archivo CSV debe contener las siguientes columnas:

```csv
correo,nombre,telefono,ciudad,notas
juan@example.com,Juan Pérez,123456789,Madrid,Cliente preferente
maria@test.com,María López,987654321,Barcelona,
```

**Validaciones:**
- `correo`: Formato email válido (obligatorio)
- `nombre`: String (obligatorio)
- `telefono`: Solo números (obligatorio)
- `ciudad`: String (obligatorio)
- `notas`: String (opcional)

## 🛠️ Desarrollo Local (sin Docker)

### Backend
```bash
cd backend
npm install
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

**Nota:** Ajusta las variables de entorno en `backend/.env`

## 🧪 Testing

```bash
# Backend
cd backend
npm test

# Frontend
cd frontend
npm run test
```

## 🎨 Características UX/Accesibilidad

- ✅ Drag & Drop intuitivo para carga de archivos
- ✅ Feedback visual claro en validaciones
- ✅ Diseño responsive (mobile-first)
- ✅ Navegación con teclado
- ✅ ARIA labels en componentes
- ✅ Contraste de colores WCAG AA
- ✅ Notificaciones accesibles

## 📦 Detener el Entorno

```bash
docker-compose down
```

Para eliminar también los datos:
```bash
docker-compose down -v
```

## � Documentación Adicional

- 📧 **[TESTING_GUIDE.md](TESTING_GUIDE.md)** - Guía rápida de pruebas (5 minutos)
- 🔐 **[EMAIL_VERIFICATION_GUIDE.md](EMAIL_VERIFICATION_GUIDE.md)** - Sistema de verificación de email completo
- 🔑 **[AUTHENTICATION.md](AUTHENTICATION.md)** - Flujo de autenticación con httpOnly cookies
- 🗄️ **[backend/MIGRATIONS.md](backend/MIGRATIONS.md)** - Sistema de migraciones de base de datos

## 🔧 Troubleshooting

### ❌ No puedo iniciar sesión después de registrarme
**Causa:** No has verificado tu email  
**Solución:** Sigue los pasos 2 y 3 de la sección "Probar el Sistema" arriba para obtener el link de verificación de los logs del backend.

### ❌ No encuentro el "Preview URL" en los logs
**Solución:**
```bash
# Ver SOLO las líneas con el link de verificación
docker-compose logs backend | Select-String "Preview URL"
```
Copia la URL completa que aparece después de `📧 Preview URL:`

### ❌ El link de verificación dice "Token inválido"
**Causa:** El token expiró (24 horas) o ya fue usado  
**Solución:** Regístrate nuevamente con otro email

### Error: "database csv_manager does not exist"
**Solución:** Asegúrate de crear la base de datos primero (ver paso 1 en "Inicio Rápido")

### Error al conectar a PostgreSQL desde pgAdmin
**Causa:** Intentas usar el nombre de host `postgres` desde tu máquina local  
**Solución:** Usa `localhost` o `127.0.0.1` en pgAdmin, NO `postgres` (ese nombre solo funciona dentro de Docker)

### ❌ Los contenedores no inician correctamente
**Solución:**
```bash
# Ver qué contenedor tiene problemas
docker-compose ps

# Ver logs de un contenedor específico
docker-compose logs backend
docker-compose logs frontend
docker-compose logs postgres
```

### Las tablas aparecen en el schema "public"
**Causa:** Estás usando una versión antigua sin migraciones
**Solución:** 
```bash
# Eliminar tablas viejas
docker-compose exec postgres psql -U postgres -d csv_manager -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"

# Reiniciar backend (las migraciones crearán las tablas en csv_app)
docker-compose restart backend
```

### Ver las tablas creadas por las migraciones
```bash
# Conectar a PostgreSQL
docker-compose exec postgres psql -U postgres -d csv_manager

# Ver schemas
\dn

# Ver tablas en csv_app
\dt csv_app.*

# Salir
\q
```

### Reiniciar migraciones desde cero
```bash
# Detener servicios
docker-compose down

# Eliminar volumen de PostgreSQL
docker volume rm csv-manager-project_postgres_data

# Recrear base de datos y reiniciar
docker-compose up -d postgres
docker-compose exec postgres psql -U postgres -c "CREATE DATABASE csv_manager;"
docker-compose up -d
```

## 📄 Licencia

MIT
---

**Desarrollado por:** Laura  
**Fecha:** Febrero 2026
