# Mr Barber Backend

Spring Boot 3.3 CMS backend powering the Mr Barber site.

## Prerequisites

- Java 17+
- Maven 3.9+
- A MySQL-compatible database: local MySQL 8 on `:3306`, or a [TiDB Cloud Serverless](https://tidbcloud.com/) cluster (MySQL wire-protocol compatible)

## Setup

1. Create the target database/schema (auto-created via `createDatabaseIfNotExist` for local MySQL; for TiDB Serverless, create the database in the console or let the app connect to the default one).
2. Set environment variables (or use the local-MySQL defaults in `application.yml`):
   ```
   # Local MySQL
   DB_HOST=localhost
   DB_PORT=3306
   DB_NAME=mrbarber
   DB_USER=root
   DB_PASSWORD=root

   # TiDB Cloud Serverless instead — get these from the cluster's "Connect" dialog
   DB_HOST=gateway01.<region>.prod.aws.tidbcloud.com
   DB_PORT=4000
   DB_NAME=mrbarber
   DB_USER=<prefix>.root
   DB_PASSWORD=<cluster password>
   DB_USE_SSL=true
   DB_SSL_MODE=VERIFY_IDENTITY

   JWT_SECRET=<base64-encoded 64-byte secret — generate with: openssl rand -base64 64>
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD=admin123
   CLOUDINARY_URL=cloudinary://<api_key>:<api_secret>@<cloud_name>
   CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:4173   # comma-separated; set to your deployed frontend origin(s) in production
   ```
3. Run:
   ```
   mvn spring-boot:run
   ```
4. The server starts on `http://localhost:8081`.
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

## File uploads

Images (logo, favicon, hero slides, transformations, hair profiles, etc.) uploaded via `POST /api/admin/files` and reel videos uploaded via `POST /api/admin/reels` both go to Cloudinary (configured by `CLOUDINARY_URL`). The URL returned is what the frontend stores in image/video fields (e.g. `logoUrl`, `faviconUrl`, `beforeImageUrl`, `videoUrl`).

## First-run checklist

1. `POST /api/auth/login` with `admin/admin123` → save token
2. `POST /api/auth/change-password` to set your own
3. Use the admin endpoints (or build a UI on top) to edit content
