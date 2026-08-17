# Mr Barber

Premium hair-studio site with a Spring Boot CMS backend powering all content.

## Project layout

```
/                    -- React + Vite frontend
backend/             -- Spring Boot 3.3 + MySQL backend
```

## Stack

- **Frontend**: React 19, Vite, Tailwind v4, framer-motion, react-router-dom 7
- **Backend**: Spring Boot 3.3, Spring Security (JWT), Spring Data JPA, MySQL-compatible (local MySQL 8 or TiDB Cloud Serverless)
- **Auth**: JWT (HS256), single ADMIN role, BCrypt password hashing
- **File storage**: Cloudinary (images and reel videos)

## Quick start

### 1. Backend

```bash
cd backend

# Local MySQL running on :3306 (schema `mrbarber` auto-created) — defaults in application.yml are fine for dev.
# Or point DB_HOST/DB_PORT/DB_USER/DB_PASSWORD at a TiDB Cloud Serverless cluster — see backend/README.md.
# Also set: JWT_SECRET, ADMIN_USERNAME, ADMIN_PASSWORD, CLOUDINARY_URL

mvn spring-boot:run
```

The first boot seeds:
- An admin user (`admin` / `admin123` by default)
- All starter site content matching the original hardcoded frontend

API listens on `http://localhost:8081`.

### 2. Frontend

```bash
# from repo root
cp .env.example .env       # one-time
npm install
npm run dev
```

- Public site → `http://localhost:5173`
- Admin CMS  → `http://localhost:5173/admin/login`

## Admin CMS

Sign in at `/admin/login` with `admin` / `admin123`, then edit any of:

| Section | What you can change |
|---|---|
| **Settings** | Brand name, logo, favicon (tab icon), page title, footer info, copyright |
| **Nav Links** | Header navigation labels and section anchors |
| **Hero Slides** | Top-of-page rotating slides |
| **Marquee** | Yellow scrolling strip text |
| **Services** | Service cards (icon name = a Lucide component) |
| **Transformations** | Before/after comparison cards |
| **Hair Profiles** | "Application for Different Hair Profiles" cards |
| **Reviews** | Customer testimonials |
| **Locations** | Studios with nested phone contacts |
| **Social Links** | Instagram, Facebook, YouTube |

Every image field has an inline upload widget — pick a file and the URL is stored automatically. Changes are reflected on the public site after a refresh (the bulk endpoint `/api/public/site` is re-fetched on each load).

## API

Full endpoint reference in [`backend/README.md`](backend/README.md). Headline endpoints:

- `POST /api/auth/login`    → `{ token, username, role, expiresInMs }`
- `GET  /api/public/site`   → entire site as one JSON tree (used by frontend on load)
- `*    /api/admin/**`      → CRUD per content type (requires Bearer token)
- `POST /api/admin/files`   → multipart image upload → `{ url }`

## Security notes

- All `/api/admin/**` routes require `Authorization: Bearer <jwt>` with role `ADMIN`
- `/api/public/**` is open (read-only)
- JWT secret is base64-encoded in `JWT_SECRET` — **generate a fresh one before deploying**:
  ```bash
  openssl rand -base64 64
  ```
- Default admin credentials are seeded once on first boot. Change immediately via `POST /api/auth/change-password` (the admin UI's password change form is a TODO follow-up).

## Adding a new icon for Services

Lucide icon names referenced by string in the DB (`services.iconName`) are resolved in [src/lib/iconMap.js](src/lib/iconMap.js). To support a new one, import it from `lucide-react` and add it to the `ICON_MAP` object there.

## Deploying

For production:
1. Set strong `JWT_SECRET`, `DB_PASSWORD`, `ADMIN_PASSWORD` env vars
2. Set `CORS_ALLOWED_ORIGINS` to your deployed frontend's origin(s) (comma-separated) — it defaults to the local dev Vite ports only, so the API will reject cross-origin requests from any other domain until this is set
3. `cd backend && mvn package` → run the resulting jar (`java -jar target/mrbarber-backend-0.0.1-SNAPSHOT.jar`)
4. `npm run build` for frontend → serve `dist/` via Nginx or copy into `backend/src/main/resources/static`, with `VITE_API_BASE_URL` pointed at the deployed backend
