# Migraciones de Base de Datos

Este proyecto usa **Sequelize CLI** para manejar migraciones de base de datos. Las tablas se crean en el schema `csv_app` en lugar del schema `public` por seguridad.

## Estructura

```
backend/
├── .sequelizerc                    # Configuración de rutas de Sequelize CLI
├── src/
│   ├── config/
│   │   ├── config.js              # Configuración de migraciones
│   │   └── database.js            # Configuración de Sequelize (schema: csv_app)
│   ├── migrations/                # Archivos de migración
│   │   ├── 20260202000001-create-schema-and-users.js
│   │   ├── 20260202000002-create-documents.js
│   │   └── 20260202000003-create-records.js
│   ├── seeders/                   # Archivos de seeders (datos iniciales)
│   └── models/                    # Modelos de Sequelize
```

## Comandos Disponibles

### Ejecutar Migraciones

```bash
# Dentro del contenedor Docker (automático al iniciar)
npm run migrate

# Fuera del contenedor (desde la carpeta backend)
cd backend
npm run migrate
```

### Ver Estado de Migraciones

```bash
npm run migrate:status
```

### Revertir Última Migración

```bash
npm run migrate:undo
```

### Revertir Todas las Migraciones

```bash
npm run migrate:undo:all
```

### Ejecutar Seeders

```bash
npm run seed
```

### Revertir Seeders

```bash
npm run seed:undo
```

## Schema Personalizado: `csv_app`

Por seguridad, **NO** se usa el schema `public`. Todas las tablas se crean en el schema `csv_app`:

- `csv_app.Users`
- `csv_app.Documents`
- `csv_app.Records`
- `csv_app.SequelizeMeta` (tabla de control de migraciones)

## Migraciones vs sync()

⚠️ **IMPORTANTE**: En el archivo `src/index.js`, se ha desactivado `sequelize.sync()`. 

**Antes:**
```javascript
await sequelize.sync({ alter: true }); // ❌ NO usar
```

**Ahora:**
```javascript
// Usar migraciones en su lugar
// npm run migrate
```

## Flujo de Trabajo con Docker

El `docker-compose.yml` está configurado para ejecutar migraciones automáticamente al iniciar el backend:

```yaml
command: sh -c "npm run migrate && npm run dev"
```

Esto significa que cada vez que se inicia el contenedor:
1. Se ejecutan las migraciones pendientes
2. Se inicia el servidor en modo desarrollo

## Limpiar y Empezar de Cero

Si necesitas borrar todo y empezar de nuevo:

```bash
# 1. Detener los contenedores
docker-compose down

# 2. Eliminar el volumen de PostgreSQL
docker volume rm csv-manager-project_postgres_data

# 3. Reiniciar los servicios (las migraciones se ejecutarán automáticamente)
docker-compose up -d
```

## Crear Nuevas Migraciones

Para crear una nueva migración:

```bash
cd backend
npx sequelize-cli migration:generate --name nombre-de-la-migracion
```

Luego edita el archivo generado en `src/migrations/` y asegúrate de incluir el schema:

```javascript
await queryInterface.createTable('NombreTabla', {
  // columnas...
}, {
  schema: 'csv_app'
});
```

## Verificar Schema en PostgreSQL

Para verificar que las tablas están en el schema correcto:

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

## Eliminar Tablas del Schema Public (si existen)

Si ya tenías tablas en el schema `public`, elimínalas:

```bash
docker-compose exec postgres psql -U postgres -d csv_manager -c "DROP TABLE IF EXISTS public.\"Users\" CASCADE;"
docker-compose exec postgres psql -U postgres -d csv_manager -c "DROP TABLE IF EXISTS public.\"Documents\" CASCADE;"
docker-compose exec postgres psql -U postgres -d csv_manager -c "DROP TABLE IF EXISTS public.\"Records\" CASCADE;"
```
