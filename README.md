# 📁 CSV Manager - Prueba Técnica Full Stack

Sistema de gestión de documentos CSV con autenticación, roles de usuario y validación de datos.

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

## 🔐 Usuarios de Prueba

Después de iniciar la aplicación, puedes registrar usuarios con los siguientes roles:
- **user**: Puede cargar y descargar documentos
- **admin**: Puede cargar, descargar y **eliminar** documentos

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
- `POST /api/auth/register` - Registro de usuarios
- `POST /api/auth/login` - Login (retorna JWT)

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

## 🔧 Troubleshooting

### Error: "database csv_manager does not exist"
**Solución:** Asegúrate de crear la base de datos primero (ver paso 1 en "Inicio Rápido")

### Error al conectar a PostgreSQL desde pgAdmin
**Causa:** Intentas usar el nombre de host `postgres` desde tu máquina local
**Solución:** Usa `localhost` o `127.0.0.1` en pgAdmin, NO `postgres` (ese nombre solo funciona dentro de Docker)

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
