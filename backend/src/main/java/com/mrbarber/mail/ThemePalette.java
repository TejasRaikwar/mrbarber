package com.mrbarber.mail;

import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Email-safe colours for each site theme.
 *
 * <p>These mirror the CSS custom properties in {@code src/index.css} and the
 * registry in {@code src/lib/themes.js}. Mail clients strip {@code <style>}
 * blocks and do not understand CSS variables, so every colour has to be inlined
 * as a literal hex value — hence this duplication. When a palette is added or
 * retuned on the front end, update the matching entry here.
 *
 * @param pageBg    canvas behind the email card
 * @param surface   the card itself
 * @param surfaceAlt header/footer bands and inset panels
 * @param border    hairlines
 * @param heading   headings on {@code surface}
 * @param text      body copy
 * @param muted     secondary/label copy
 * @param accent    brand accent (headline colour, links, rules)
 * @param onAccent  text placed on top of {@code accent}
 */
public record ThemePalette(
        String pageBg,
        String surface,
        String surfaceAlt,
        String border,
        String heading,
        String text,
        String muted,
        String accent,
        String onAccent
) {

    public static final String DEFAULT_ID = "beige";

    private static final Map<String, ThemePalette> PALETTES = new LinkedHashMap<>();

    private static void put(String id, ThemePalette p) {
        PALETTES.put(id, p);
    }

    static {
        put("beige", new ThemePalette(
                "#f5eee4", "#ffffff", "#faf6f0", "#e6dbcb",
                "#3b2f26", "#4a3c31", "#7a6a5b", "#8b5e3c", "#ffffff"));

        put("latte", new ThemePalette(
                "#f8f1e6", "#ffffff", "#fbf6ee", "#ebdfcd",
                "#493a2c", "#57462f", "#857260", "#a97442", "#ffffff"));

        put("walnut", new ThemePalette(
                "#f3ebdd", "#ffffff", "#f6f0e6", "#e1d4c0",
                "#33281f", "#43352a", "#6e5e4d", "#6f4e37", "#ffffff"));

        put("clay", new ThemePalette(
                "#f9eee7", "#ffffff", "#fbf2ed", "#ecdcd2",
                "#3f2c26", "#4e372f", "#7e635a", "#a9573f", "#ffffff"));

        put("olive", new ThemePalette(
                "#f4f1e4", "#ffffff", "#f7f4ea", "#e2ded0",
                "#343329", "#434234", "#6c6a55", "#6f7047", "#ffffff"));

        put("emerald", new ThemePalette(
                "#edf4f0", "#ffffff", "#eff5f2", "#dae7e1",
                "#1e3a33", "#2b4a42", "#58756c", "#1f6f5c", "#ffffff"));

        put("teal", new ThemePalette(
                "#ecf4f4", "#ffffff", "#eef5f5", "#d7e7e8",
                "#17383a", "#254a4c", "#547073", "#16656b", "#ffffff"));

        put("navy", new ThemePalette(
                "#eef2f7", "#ffffff", "#f0f3f8", "#dbe3ee",
                "#1e2c42", "#2c3c55", "#58677f", "#24456e", "#ffffff"));

        put("burgundy", new ThemePalette(
                "#f8eef0", "#ffffff", "#f9eff1", "#ecd8dc",
                "#3b1f27", "#4c2c34", "#79575e", "#7d2b3d", "#ffffff"));

        put("plum", new ThemePalette(
                "#f3edf6", "#ffffff", "#f5f0f7", "#e4d9ea",
                "#33253a", "#43324b", "#695872", "#5e3a66", "#ffffff"));

        put("gold", new ThemePalette(
                "#f7f2e2", "#ffffff", "#faf6ea", "#e8dfc6",
                "#2a2620", "#3a352c", "#6c644f", "#9a7b1f", "#ffffff"));

        put("mono", new ThemePalette(
                "#f5f5f5", "#ffffff", "#fafafa", "#e4e4e4",
                "#1c1c1c", "#2e2e2e", "#656565", "#2f2f2f", "#ffffff"));

        // "site" reuses the beige neutrals; its accent comes from
        // SiteSettings.themeColor and is substituted in withAccent().
        put("site", PALETTES.get("beige"));

        put("midnight", new ThemePalette(
                "#0f0c0a", "#1e1814", "#1a1511", "#362c24",
                "#f4ece2", "#e4d8ca", "#ab9786", "#d9b48f", "#241b14"));

        put("noir", new ThemePalette(
                "#0a0a0b", "#191919", "#141414", "#2e2e2e",
                "#f2efe8", "#ded9cf", "#a8a294", "#c9a227", "#1a1608"));
    }

    /** Resolve a theme id, falling back to the default for unknown ids. */
    public static ThemePalette of(String themeId) {
        if (themeId == null || themeId.isBlank()) return PALETTES.get(DEFAULT_ID);
        return PALETTES.getOrDefault(themeId.trim(), PALETTES.get(DEFAULT_ID));
    }

    /** True when this theme takes its accent from SiteSettings.themeColor. */
    public static boolean usesSiteAccent(String themeId) {
        return "site".equals(themeId);
    }

    /**
     * Resolve the palette for a theme, swapping in the customer's own accent
     * when the "Site Brand" theme is selected.
     */
    public static ThemePalette resolve(String themeId, String siteAccent) {
        ThemePalette base = of(themeId);
        if (!usesSiteAccent(themeId) || !isHex(siteAccent)) return base;
        return base.withAccent(siteAccent.trim(), contrastForeground(siteAccent.trim()));
    }

    public ThemePalette withAccent(String newAccent, String newOnAccent) {
        return new ThemePalette(pageBg, surface, surfaceAlt, border,
                heading, text, muted, newAccent, newOnAccent);
    }

    private static boolean isHex(String value) {
        return value != null && value.trim().matches("^#[0-9a-fA-F]{6}$");
    }

    /**
     * WCAG relative luminance — picks black or white for text on the given
     * background. Mirrors src/lib/colorContrast.js.
     */
    static String contrastForeground(String hex) {
        String c = hex.replace("#", "");
        double r = Integer.parseInt(c.substring(0, 2), 16) / 255.0;
        double g = Integer.parseInt(c.substring(2, 4), 16) / 255.0;
        double b = Integer.parseInt(c.substring(4, 6), 16) / 255.0;
        double luminance = 0.2126 * linear(r) + 0.7152 * linear(g) + 0.0722 * linear(b);
        return luminance > 0.45 ? "#000000" : "#ffffff";
    }

    private static double linear(double v) {
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    }
}
