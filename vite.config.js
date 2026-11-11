import fs from "fs"
import path from "path"
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { getSeoRoutes, renderHead, renderBody, renderSitemap } from "./src/seo/siteSeo.js"

/**
 * Pre-renders SEO for every public route (see src/seo/siteSeo.js):
 *   - dev + build: fills <!--seo-head--> in index.html with the home page tags
 *   - build: writes dist/<route>/index.html for each landing page with its own
 *     title/description/canonical/JSON-LD and a static copy of its content in
 *     #root, then writes dist/sitemap.xml.
 * Optional env: VITE_GOOGLE_SITE_VERIFICATION, VITE_BING_SITE_VERIFICATION.
 */
const seoPrerender = (env) => {
  const verification = {
    googleVerification: env.VITE_GOOGLE_SITE_VERIFICATION,
    bingVerification: env.VITE_BING_SITE_VERIFICATION
  }
  const HEAD_START = "<!--seo:start-->"
  const HEAD_END = "<!--seo:end-->"
  const headFor = (route) => `${HEAD_START}\n    ${renderHead(route, verification)}\n    ${HEAD_END}`
  let outDir = "dist"

  return {
    name: "seo-prerender",
    configResolved(config) {
      outDir = path.resolve(config.root, config.build.outDir)
    },
    transformIndexHtml: {
      order: "pre",
      handler(html) {
        const home = getSeoRoutes().find((r) => r.path === "/")
        return html.replace("<!--seo-head-->", headFor(home))
      }
    },
    closeBundle() {
      const indexPath = path.join(outDir, "index.html")
      if (!fs.existsSync(indexPath)) return
      const template = fs.readFileSync(indexPath, "utf8")
      const headRe = new RegExp(`${HEAD_START}[\\s\\S]*?${HEAD_END}`)

      for (const route of getSeoRoutes()) {
        const html = template
          .replace(headRe, headFor(route))
          .replace("<!--seo-body-->", renderBody(route))
        const file = route.path === "/"
          ? indexPath
          : path.join(outDir, route.path.slice(1), "index.html")
        fs.mkdirSync(path.dirname(file), { recursive: true })
        fs.writeFileSync(file, html)
      }

      const today = new Date().toISOString().slice(0, 10)
      fs.writeFileSync(path.join(outDir, "sitemap.xml"), renderSitemap(today))
    }
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, ".")
  return {
    plugins: [react(), tailwindcss(), seoPrerender(env)],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src")
      }
    },
    server: {
      watch: {
        usePolling: true
      }
    }
  }
})
