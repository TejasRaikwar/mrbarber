import { useEffect } from "react"

/**
 * Keep <title> and the tab favicon in sync with admin-configured settings.
 * Falls back to the existing index.html values if a field is empty.
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
    }, [settings])
}

