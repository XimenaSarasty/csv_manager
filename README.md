# CSV Manager - Prueba Técnica Full Stack

Sistema de gestión de documentos CSV con autenticación, verificación de email, roles de usuario y validación de datos.

## Características Principales

- **Autenticación Segura:** JWT con httpOnly cookies
- **Verificación de Email:** Sistema completo con tokens de 24 horas y Ethereal Mail
- **Roles y Permisos:** Control de acceso basado en roles (RBAC)
- **Validación CSV:** Reglas estrictas con mensajes detallados en español
- **Migraciones de BD:** Schema personalizado `csv_app` con Sequelize CLI
- **UI Moderna:** Vue 3 (Options API) + Tailwind CSS con componentes reactivos
- **Accesibilidad WCAG:** Menú dedicado con zoom, alto contraste y escala de grises
- **Confirmaciones Seguras:** Diálogos modales para prevenir eliminaciones accidentales
- **Docker Healthchecks:** Inicialización coordinada con verificación de servicios

## Stack Tecnológico

**Backend:**
- Node.js 24.x LTS + Express 4.18
- PostgreSQL 15 Alpine
- Sequelize ORM 6.35 + Sequelize CLI (Migrations)
- JWT Authentication + bcryptjs
- Multer (file upload) + csv-parse 5.5
- Nodemailer 7 (Ethereal para desarrollo)
- Validator.js (validación de emails)

**Frontend:**
- Vue 3 (Options API)
- Tailwind CSS 3.4
- Axios (API client)
- Vue Router 4
- Vite 5
- Componentes modulares (Navbar, FileUpload, DocumentsTable, Notification, ConfirmDialog, AccessibilityMenu)

**Infraestructura:**
- Docker & Docker Compose
- Node.js 24 Alpine
- PostgreSQL Healthchecks
- Volúmenes persistentes
- Network isolation (bridge)

## Requisitos Previos

- Docker & Docker Compose instalados
- pgAdmin u otro cliente PostgreSQL (para crear la base de datos inicial)
- Puertos disponibles: 5432 (PostgreSQL), 3000 (Backend), 5173 (Frontend)

## Inicio Rápido
### Clonar el repositorio

```bash
git clone https://github.com/XimenaSarasty/csv_manager.git
cd csv_manager
```

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
cd C:\..\..\..
```

### 3. Levantar todo el entorno con Docker
```bash
docker-compose up --build
```

** Nota Importante sobre Migraciones:**
- El proyecto usa **Sequelize Migrations** para crear las tablas automáticamente
- Las tablas se crean en el schema `csv_app` (NO en `public`) por seguridad
- Las migraciones se ejecutan automáticamente al iniciar el backend

Esto iniciará:
- PostgreSQL en `localhost:5432`
- Backend API en `http://localhost:3000` (ejecuta migraciones automáticamente)
- Frontend en `http://localhost:5173`

### 4. Verificar que las migraciones se ejecutaron correctamente

Puedes verificar los logs del backend:
```bash
docker-compose logs backend
```

Deberías ver algo como:
```
Database connection established successfully.
Sequelize CLI [Node: ...] 
== 20260202000001-create-schema-and-users: migrating =======
== 20260202000001-create-schema-and-users: migrated
...
Recuerda ejecutar las migraciones: npm run migrate
Server running on http://localhost:3000
```

### 5. Acceder a la aplicación
Abre tu navegador en: **http://localhost:5173**

### 6. Probar el Sistema (Flujo Completo)

#### Paso 1: Registrar un usuario

1. En el navegador, ve a la página de registro
2. Completa el formulario con tus datos:
   - **Email:** tu-email@ejemplo.com (puede ser cualquier email, incluso uno falso)
   - **Nombre:** Tu Nombre
   - **Contraseña:** mínimo 6 caracteres
   - **Rol:** selecciona `user` o `admin`
3. Haz clic en **"Registrarse"**
4. Verás un mensaje: _"Registro exitoso. Revisa tu email para verificar tu cuenta."_

**IMPORTANTE:** El email NO llegará a tu bandeja real. El sistema usa **Ethereal** (emails de prueba) para desarrollo.

#### Paso 2: Obtener el link de verificación

Para ver el email que "se envió", necesitas copiar una URL especial de los logs:

1. Abre PowerShell en la carpeta del proyecto
2. Ejecuta este comando:
   ```powershell
   docker-compose logs backend | Select-String "Preview URL"
   ```

3. Verás algo como esto:
   ```
   Preview URL: https://ethereal.email/message/aYFYLb2PRWtCli93...
   ```

4. **Copia toda esa URL** (desde `https://` hasta el final)

#### Paso 3: Ver el email de verificación

1. **Pega la URL** que copiaste en tu navegador
2. Se abrirá una página de Ethereal mostrando el email completo
3. Verás un email y un botón azul que dice **"Verificar mi correo"**
4. **Haz clic en ese botón**

#### Paso 4: Confirmar la verificación

1. Al hacer clic, te redirigirá automáticamente a la aplicación
2. Verás el mensaje: _"¡Email verificado exitosamente! Ahora puedes iniciar sesión."_
3. Espera 3 segundos y serás redirigido automáticamente al login

#### Paso 5: Iniciar sesión

1. Ingresa el **mismo email y contraseña** que usaste al registrarte
2. Haz clic en **"Iniciar sesión"**
3. ¡Listo! Ahora estás dentro de la aplicación

---

## Roles de Usuario

Una vez que hayas verificado tu email e iniciado sesión:
- **user**: Puede cargar y descargar documentos CSV
- **admin**: Puede cargar, descargar y **eliminar** documentos CSV

## Estructura del Proyecto

```      # API Node.js + Express
│   ├── src/
│   │   ├── config/            # Configuración de BD y variables de entorno
│   │   ├── models/            # Modelos Sequelize (User, Document, Record)
│   │   ├── routes/            # Endpoints REST (auth, documents)
│   │   ├── middleware/        # Auth JWT & RBAC por roles
│   │   ├── migrations/        # Migraciones de BD versionadas
│   │   ├── services/          # Lógica de negocio (email.service)
│   │   └── utils/             # Validadores CSV con reglas detalladas
│   ├── Dockerfile
│   └── package.json
├── frontend/                  # Vue 3 App (Options API)
│   ├── src/
│   │   ├── components/        # 6 componentes reutilizables:
│   │   │   ├── Navbar.vue              # Navegación principal
│   │   │   ├── FileUpload.vue          # Drag & Drop de CSV
│   │   │   ├── DocumentsTable.vue      # Tabla con paginación
│   │   │   ├── Notification.vue        # Toast notifications
│   │   │   ├── ConfirmDialog.vue       # Diálogos modales
│   │   │   └── AccessibilityMenu.vue   # Menú de accesibilidad
│   │   ├── views/             # Login, Register, Dashboard, VerifyEmail
│   │   ├── router/            # Vue Router con guards de autenticación
│   │   └── services/          # API calls (auth, document, confirm, authState)
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml         # Orquestación completa con healthchecks
└── uploads/                   # Archivos CSV cargados (persistente)
│   └── package.json
└── docker-compose.yml   # Orquestación completa
```

## API Endpoints

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

## Formato CSV Esperado

El archivo CSV debe contener las siguientes columnas:

```csv
correo,nombre,telefono,ciudad,notas
lorenzo.parra@example.com,Lorenzo Parra,123456789,Madrid,Cliente preferente
enrique.diaz@test.com,Enrique Diaz,987654321,Barcelona,Nuevo cliente
```

**Validaciones:**
- `correo`: Formato email válido (obligatorio)
- `nombre`: String (obligatorio)
- `telefono`: Solo números (obligatorio)
- `ciudad`: String (obligatorio)
- `notas`: String (opcional)

## Desarrollo Local (sin Docker)

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

## Características UX/Accesibilidad

- **Drag & Drop** intuitivo para carga de archivos CSV
- **Feedback visual** claro en validaciones con errores específicos por fila
- **Diseño responsive** mobile-first con Tailwind CSS
- **Navegación con teclado** completa en todos los componentes
- **ARIA labels** semánticos en formularios e interacciones
- **Contraste de colores** WCAG AA verificado
- **Notificaciones toast** accesibles con auto-cierre y estados (success/error/warning)
- **Menú de accesibilidad flotante** con opciones de:
  - 🔍 Zoom de texto (80% - 150%)
  - 🎨 Alto contraste automático
  - 🌑 Escala de grises para daltonismo
  - 🔲 Resaltado de enlaces
  - ⚡ Animaciones reducidas
  - 💬 Modo lectura fácil
- ✅ **Diálogos de confirmación** antes de acciones destructivas (eliminar documentos)
- ✅ **Estados de carga** con spinners y feedback de progreso
- ✅ **Toggle de visibilidad** en campos de contraseña

## Detener el Entorno

```bash
docker-compose down
```

Para eliminar también los datos:
```bash
docker-compose down -v
```

## 🔧 Troubleshooting

### No puedo iniciar sesión después de registrarme
**Causa:** No has verificado tu email  
**Solución:** Sigue los pasos 2 y 3 de la sección "Probar el Sistema" arriba para obtener el link de verificación de los logs del backend.

### No encuentro el "Preview URL" en los logs
**Solución:**
```bash
# Ver SOLO las líneas con el link de verificación
docker-compose logs backend | Select-String "Preview URL"
```
Copia la URL completa que aparece después de `Preview URL:`

### El link de verificación dice "Token inválido"
**Causa:** El token expiró (24 horas) o ya fue usado  
**Solución:** Regístrate nuevamente con otro email

### Error: "database csv_manager does not exist"
**Solución:** Asegúrate de crear la base de datos primero (ver paso 1 en "Inicio Rápido")

### Error al conectar a PostgreSQL desde pgAdmin
**Causa:** Intentas usar el nombre de host `postgres` desde tu máquina local  
**Solución:** Usa `localhost` o `127.0.0.1` en pgAdmin, NO `postgres` (ese nombre solo funciona dentro de Docker)

### Los contenedores no inician correctamente
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
---

**Desarrollado por:** Laura Ximena Limas Sarasty 
**Fecha:** Febrero 2026
