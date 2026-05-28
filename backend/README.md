# Mr Barber Backend

Spring Boot 3.3 CMS backend powering the Mr Barber site.

## Prerequisites

- Java 17+
- Maven 3.9+
- MySQL 8 running locally on `:3306`

## Setup

1. Create a MySQL user/grant (or use root). The schema `mrbarber` is auto-created via the JDBC URL.
2. Set environment variables (or use the defaults in `application.yml`):
   ```
   DB_USER=root
   DB_PASSWORD=root
   JWT_SECRET=<base64-encoded 64-byte secret — generate with: openssl rand -base64 64>
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD=admin123
   ```
3. Run:
   ```
   mvn spring-boot:run
   ```
4. The server starts on `http://localhost:8080`.
5. On first boot, an admin user (`admin` / `admin123` by default) and starter site content are seeded automatically.

## API surface

### Auth (public)
- `POST /api/auth/login`           — `{ username, password }` → `{ token, username, role, expiresInMs }`
- `GET  /api/auth/me`              — current user (requires `Authorization: Bearer <token>`)
- `POST /api/auth/change-password` — `{ currentPassword, newPassword }`

### Public site (no auth)
- `GET /api/public/site`           — **single bulk endpoint** returning the entire site as one JSON tree
- `GET /api/public/settings`
- `GET /api/public/nav-links`
- `GET /api/public/hero-slides`
- `GET /api/public/marquee`
- `GET /api/public/services`
- `GET /api/public/transformations`
- `GET /api/public/hair-profiles`
- `GET /api/public/reviews`
- `GET /api/public/locations`
- `GET /api/public/social-links`

### Admin (Bearer token + ROLE_ADMIN)
For each content type below: `GET`, `POST` (create), `PUT /{id}` (update), `DELETE /{id}`.
- `/api/admin/settings`            — `GET`/`PUT` only (single row)
- `/api/admin/nav-links`
- `/api/admin/hero-slides`
- `/api/admin/marquee`
- `/api/admin/services`
- `/api/admin/transformations`
- `/api/admin/hair-profiles`
- `/api/admin/reviews`
- `/api/admin/locations`           — contacts are nested in body
- `/api/admin/social-links`
- `POST /api/admin/files` (`multipart/form-data`, field `file`) → `{ url }` for uploaded image

### Static assets
- `/uploads/**` — public read of stored images.

## File uploads

Files go to `./uploads/` (override with `UPLOADS_DIR`). The URL returned by `/api/admin/files` is what the frontend stores in image fields (e.g. `logoUrl`, `faviconUrl`, `beforeImageUrl`).

## First-run checklist

1. `POST /api/auth/login` with `admin/admin123` → save token
2. `POST /api/auth/change-password` to set your own
3. Use the admin endpoints (or build a UI on top) to edit content
