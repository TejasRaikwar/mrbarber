import { useEffect } from "react"
import { SITE, absoluteUrl } from "@/seo/siteSeo"

const upsertMeta = (attr, key, content) => {
    let el = document.head.querySelector(`meta[${attr}="${key}"]`)
    if (!content) {
        el?.remove()
        return
    }
    if (!el) {
        el = document.createElement("meta")
        el.setAttribute(attr, key)
        document.head.appendChild(el)
    }
    el.setAttribute("content", content)
}

const upsertCanonical = (href) => {
    let el = document.head.querySelector("link[rel='canonical']")
    if (!el) {
        el = document.createElement("link")
        el.rel = "canonical"
        document.head.appendChild(el)
    }
    el.href = href
}

const upsertJsonLd = (id, data) => {
    let el = document.getElementById(id)
    if (!data) {
        el?.remove()
        return
    }
    if (!el) {
        el = document.createElement("script")
        el.type = "application/ld+json"
        el.id = id
        document.head.appendChild(el)
    }
    el.textContent = JSON.stringify(data)
}

/**
 * Keep the page's SEO tags in sync on client-side navigation. The build-time
 * pre-renderer writes the same tags into each route's HTML (see
 * src/seo/siteSeo.js), so this only matters once the app is running.
 *
 * `jsonLd` fills <script id="ld-page">; `extraJsonLd` fills
 * <script id="ld-dynamic"> for data that only exists at runtime (admin content).
 */
export const useSeo = ({ title, description, path = "/", image, jsonLd = null, extraJsonLd = null }) => {
    useEffect(() => {
        const url = absoluteUrl(path)
        const img = image || SITE.ogImage

        if (title) document.title = title
        upsertMeta("name", "description", description)
        upsertCanonical(url)
        upsertMeta("property", "og:title", title)
        upsertMeta("property", "og:description", description)
        upsertMeta("property", "og:url", url)
        upsertMeta("property", "og:image", img)
        // The fixed width/height only describe the default image.
        upsertMeta("property", "og:image:width", img === SITE.ogImage ? String(SITE.ogImageWidth) : null)
        upsertMeta("property", "og:image:height", img === SITE.ogImage ? String(SITE.ogImageHeight) : null)
        upsertJsonLd("ld-page", jsonLd)
        upsertJsonLd("ld-dynamic", extraJsonLd)
    }, [title, description, path, image, jsonLd, extraJsonLd])
}
