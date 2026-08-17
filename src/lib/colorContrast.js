// WCAG relative luminance — picks a legible foreground (black/white) for a given background hex.
export const getContrastForeground = (hex) => {
    const c = hex.replace("#", "")
    const r = parseInt(c.substring(0, 2), 16) / 255
    const g = parseInt(c.substring(2, 4), 16) / 255
    const b = parseInt(c.substring(4, 6), 16) / 255
    const lin = (v) => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4))
    const luminance = 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b)
    return luminance > 0.45 ? "#000000" : "#ffffff"
}
