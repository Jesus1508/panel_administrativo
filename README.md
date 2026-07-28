# Panel Administrativo Institucional

Portal institucional (páginas, noticias, recursos descargables) con panel administrativo,
inspirado en los sitios institucionales que desarrollé con Angular, PHP y MySQL.

## Stack

- **Backend**: Node.js, Express, MySQL (Sequelize ORM), JWT, Multer (subida de archivos local).
- **Frontend**: Angular (standalone components, signals), Tailwind CSS.

## Estructura

```
panel_administrativo/
  backend/   API REST (auth, páginas, noticias, recursos, usuarios)
  frontend/  Aplicación Angular (sitio público + panel administrativo)
```

## Backend

```bash
cd backend
npm install
cp .env.example .env   # completa los datos de tu MySQL local y un JWT_SECRET
npm run create-admin    # crea el primer usuario administrador (usa ADMIN_* del .env)
npm run dev
```

Variables de entorno (`.env`):

- `PORT` — puerto del servidor (por defecto 4002).
- `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD` — conexión a MySQL.
- `JWT_SECRET` — secreto para firmar los tokens.
- `FRONTEND_URL` — origen permitido por CORS en producción.

## Frontend

```bash
cd frontend
npm install
npm run start   # ng serve, http://localhost:4200
```

La URL del backend está definida en `src/app/core/config.ts` (`http://localhost:4002/api`
por defecto).

## Modelo de datos

- **Usuario**: nombre, email, contraseña — sin roles, cualquier usuario tiene acceso
  completo al panel.
- **Pagina**: título, slug, contenido, orden, publicada.
- **Noticia**: título, slug, resumen, contenido, imagen (opcional), publicada, fecha de
  publicación.
- **Recurso**: título, descripción, categoría, archivo descargable.

## Funcionalidad

- Sitio público: inicio con últimas noticias, páginas institucionales dinámicas,
  listado y detalle de noticias, recursos descargables, formulario de contacto.
- Panel administrativo (Angular con guard de autenticación): CRUD de páginas,
  noticias (con subida de imagen), recursos (con subida de archivo) y usuarios
  administradores (crear/eliminar, protegido contra auto-eliminación y contra
  quedarse sin ningún administrador).
