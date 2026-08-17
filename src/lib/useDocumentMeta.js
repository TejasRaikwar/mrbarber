import { useEffect } from "react"
import { getContrastForeground } from "./colorContrast"

const DEFAULT_BRAND = "#eab308"

/**
 * Keep <title>, the tab favicon, and the brand accent color in sync with admin-configured settings.
 * Falls back to the existing index.html/CSS values if a field is empty.
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
        document.documentElement.style.setProperty("--brand", brand)
        document.documentElement.style.setProperty("--brand-foreground", getContrastForeground(brand))
    }, [settings])
}

