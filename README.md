# Mr Barber

Premium hair-studio site with a Spring Boot CMS backend powering all content.

## Project layout

```
/                    -- React + Vite frontend
backend/             -- Spring Boot 3.3 + MySQL backend
```

## Stack

- **Frontend**: React 19, Vite, Tailwind v4, framer-motion, react-router-dom 7
- **Backend**: Spring Boot 3.3, Spring Security (JWT), Spring Data JPA, MySQL 8
- **Auth**: JWT (HS256), single ADMIN role, BCrypt password hashing
- **File storage**: Local disk, served via `/uploads/**`

## Quick start

### 1. Backend

```bash
cd backend

# Ensure MySQL is running on :3306 (the schema `mrbarber` is auto-created).
# Optionally set env vars (defaults in application.yml are fine for dev):
#   DB_USER, DB_PASSWORD, JWT_SECRET, ADMIN_USERNAME, ADMIN_PASSWORD

mvn spring-boot:run
```

The first boot seeds:
- An admin user (`admin` / `admin123` by default)
- All starter site content matching the original hardcoded frontend

API listens on `http://localhost:8080`.

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
- `/api/public/**` and `/uploads/**` are open (read-only)
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
2. `cd backend && mvn package` → run the resulting jar (`java -jar target/mrbarber-backend-0.0.1-SNAPSHOT.jar`)
3. `npm run build` for frontend → serve `dist/` via Nginx or copy into `backend/src/main/resources/static`
4. Set `app.uploads.public-base-url` to your final domain so uploaded image URLs are correct
