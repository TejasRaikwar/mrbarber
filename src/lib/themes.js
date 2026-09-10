// Theme registry — every entry maps to a palette block in src/index.css.
//
// `className` is applied to <html>; the default theme owns :root and so
// carries an empty class. A theme may list several classes separated by a
// space (Noir rides on .dark so `dark:` variants keep working).
//
// `swatch` drives the preview chips in the picker: [canvas, surface, accent].
//
// IMPORTANT: the same ids and accents are mirrored server-side in
// backend/src/main/java/com/mrbarber/mail/ThemePalette.java so transactional
// email matches the site. Add a theme in both places.

export const THEMES = [
    {
        id: "beige",
        name: "Beige & Brown",
        description: "White canvas, warm beige surfaces, brown accent.",
        className: "",
        swatch: ["#ffffff", "#f0e6d8", "#8b5e3c"]
    },
    {
        id: "latte",
        name: "Latte Cream",
        description: "Softer cream surfaces with a caramel accent.",
        className: "theme-latte",
        swatch: ["#ffffff", "#f3e8d8", "#a97442"]
    },
    {
        id: "walnut",
        name: "Walnut Sand",
        description: "Sand surfaces with a deep espresso accent.",
        className: "theme-walnut",
        swatch: ["#ffffff", "#ece0cd", "#6f4e37"]
    },
    {
        id: "clay",
        name: "Rose Clay",
        description: "Blush-beige surfaces with a terracotta accent.",
        className: "theme-clay",
        swatch: ["#ffffff", "#f4e2d8", "#a9573f"]
    },
    {
        id: "olive",
        name: "Olive Grove",
        description: "Taupe-beige surfaces with a muted olive accent.",
        className: "theme-olive",
        swatch: ["#ffffff", "#ece9d7", "#6f7047"]
    },
    {
        id: "emerald",
        name: "Emerald Atelier",
        description: "Soft sage surfaces with a deep emerald accent.",
        className: "theme-emerald",
        swatch: ["#ffffff", "#dce9e3", "#1f6f5c"]
    },
    {
        id: "teal",
        name: "Teal Marble",
        description: "Pale marble surfaces with a cool teal accent.",
        className: "theme-teal",
        swatch: ["#ffffff", "#d8e9ea", "#16656b"]
    },
    {
        id: "navy",
        name: "Navy Oxford",
        description: "Pale blue-grey surfaces with a classic navy accent.",
        className: "theme-navy",
        swatch: ["#ffffff", "#dde5f0", "#24456e"]
    },
    {
        id: "burgundy",
        name: "Burgundy Velvet",
        description: "Blush surfaces with a deep wine accent.",
        className: "theme-burgundy",
        swatch: ["#ffffff", "#f0dbdf", "#7d2b3d"]
    },
    {
        id: "plum",
        name: "Plum Noir",
        description: "Soft lilac surfaces with an aubergine accent.",
        className: "theme-plum",
        swatch: ["#ffffff", "#e8dcee", "#5e3a66"]
    },
    {
        id: "gold",
        name: "Gold Leaf",
        description: "Ivory surfaces, charcoal text, antique gold accent.",
        className: "theme-gold",
        swatch: ["#ffffff", "#f0e7cc", "#9a7b1f"]
    },
    {
        id: "mono",
        name: "Classic Mono",
        description: "White canvas with a charcoal accent.",
        className: "theme-mono",
        swatch: ["#ffffff", "#f1f1f1", "#2f2f2f"]
    },
    {
        id: "site",
        name: "Site Brand",
        description: "Beige neutrals using the accent from Site Settings.",
        className: "theme-site",
        swatch: ["#ffffff", "#f0e6d8", "var(--brand-site, #8b5e3c)"],
        usesSiteAccent: true
    },
    {
        id: "midnight",
        name: "Midnight",
        description: "Dark, warm neutrals with a beige accent.",
        className: "dark",
        swatch: ["#14100d", "#2a221c", "#d9b48f"],
        isDark: true
    },
    {
        id: "noir",
        name: "Noir & Gold",
        description: "Near-black canvas with an antique gold accent.",
        className: "dark theme-noir",
        swatch: ["#0f0f10", "#232323", "#c9a227"],
        isDark: true
    }
]

export const DEFAULT_THEME_ID = "beige"

/**
 * Last theme fetched from the server, cached purely so the very first paint
 * (before Site Settings has loaded) doesn't flash the default palette. This is
 * a performance cache, not a preference store — the database row is always
 * the source of truth, and this is overwritten every time settings load.
 */
export const THEME_CACHE_KEY = "site-theme-cache"

export const getTheme = (id) =>
    THEMES.find((t) => t.id === id) || THEMES.find((t) => t.id === DEFAULT_THEME_ID)

const classesOf = (theme) => (theme.className ? theme.className.split(/\s+/) : [])

/** Swap the theme classes on <html>, clearing whichever ones are set. */
export const applyTheme = (id) => {
    const root = document.documentElement
    THEMES.forEach((t) => classesOf(t).forEach((c) => root.classList.remove(c)))
    const theme = getTheme(id)
    classesOf(theme).forEach((c) => root.classList.add(c))
    return theme
}

/** Cache the resolved site theme so the next cold load paints it immediately. */
export const cacheSiteTheme = (id) => {
    try {
        localStorage.setItem(THEME_CACHE_KEY, id)
    } catch {
        /* caching is best-effort */
    }
}
