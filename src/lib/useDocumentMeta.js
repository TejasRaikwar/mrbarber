import { useEffect } from "react"
import { getContrastForeground } from "./colorContrast"

const DEFAULT_BRAND = "#8b5e3c"

/**
 * Keep <title>, the tab favicon, and the admin-configured brand color in sync
 * with site settings. Falls back to the existing index.html/CSS values if a
 * field is empty.
 *
 * The brand color is published as --brand-site rather than --brand: each theme
 * ships its own harmonized accent, and only the "Site Brand" theme opts into
 * this one (see .theme-site in index.css). That keeps an inline style from
 * overriding every palette.
 */
export const useDocumentMeta = (settings) => {
    useEffect(() => {
        if (!settings) return

        const title = settings.pageTitle || settings.siteName
        if (title) {
            document.title = title
        }

        if (settings.faviconUrl) {
            let link = document.querySelector("link[rel~='icon']")
            if (!link) {
                link = document.createElement("link")
                link.rel = "icon"
                document.head.appendChild(link)
            }
            link.href = settings.faviconUrl
        }

        const brand = settings.themeColor || DEFAULT_BRAND
        document.documentElement.style.setProperty("--brand-site", brand)
        document.documentElement.style.setProperty(
            "--brand-site-foreground",
            getContrastForeground(brand)
        )
    }, [settings])
}
