import { createContext, useContext, useEffect, useLayoutEffect, useMemo } from "react"
import { THEMES, DEFAULT_THEME_ID, applyTheme, cacheSiteTheme, getTheme } from "@/lib/themes"
import { useSiteContent } from "@/context/SiteContentContext"

const ThemeContext = createContext(null)

/**
 * Owns the site-wide palette.
 *
 * The theme is a per-customer brand decision, so it is read entirely from
 * Site Settings on the server (`settings.themeId`) — never from this browser's
 * localStorage. That's what keeps it consistent for every visitor and device,
 * and it's the same value the backend reads when rendering transactional email.
 */
export const ThemeProvider = ({ children }) => {
    const { settings } = useSiteContent()
    const themeId = settings?.themeId || DEFAULT_THEME_ID

    useLayoutEffect(() => {
        applyTheme(themeId)
    }, [themeId])

    // Refresh the cold-load cache once settings are known, so the next visit
    // paints the right palette before this ever runs.
    useEffect(() => {
        if (settings?.themeId) cacheSiteTheme(settings.themeId)
    }, [settings?.themeId])

    // Match the mobile browser chrome to the palette's canvas.
    useEffect(() => {
        const background = getComputedStyle(document.documentElement)
            .getPropertyValue("--background")
            .trim()
        if (!background) return

        let meta = document.querySelector("meta[name='theme-color']")
        if (!meta) {
            meta = document.createElement("meta")
            meta.name = "theme-color"
            document.head.appendChild(meta)
        }
        meta.content = background
    }, [themeId])

    const value = useMemo(
        () => ({
            themeId,
            theme: getTheme(themeId),
            themes: THEMES
        }),
        [themeId]
    )

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export const useTheme = () => {
    const ctx = useContext(ThemeContext)
    if (!ctx) throw new Error("useTheme must be used inside <ThemeProvider>")
    return ctx
}
