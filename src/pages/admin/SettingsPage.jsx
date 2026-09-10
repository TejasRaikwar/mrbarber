import { useEffect, useState } from "react"
import { Scissors } from "lucide-react"
import { api } from "@/api/client"
import { useSiteContent } from "@/context/SiteContentContext"
import { useToast } from "@/context/ToastContext"
import { TextField, TextArea, Button, PageHeader } from "./components/FormFields"
import ImageUpload from "./components/ImageUpload"
import ColorSwatchField from "./components/ColorSwatchField"
import ThemePicker from "@/components/ui/ThemePicker"
import { DEFAULT_THEME_ID, getTheme } from "@/lib/themes"

/**
 * Scoped preview of a theme, without ever touching <html> — the class only
 * applies to this card, so it can show a theme that isn't saved yet without
 * affecting the rest of the admin UI (or persisting anywhere).
 */
const ThemePreview = ({ themeId, usesSiteAccent, siteColor }) => {
    const theme = getTheme(themeId)
    return (
        <div className={theme.className}>
            <div
                className="rounded-2xl border border-border bg-background p-4 overflow-hidden"
                style={usesSiteAccent && siteColor ? { "--brand-site": siteColor } : undefined}
            >
                <div className="flex items-center justify-between rounded-lg bg-card border border-border px-4 py-2.5 mb-4">
                    <div className="flex items-center gap-2">
                        <Scissors className="w-4 h-4 text-(--brand)" />
                        <span className="text-sm font-bold text-foreground">Your Site Name</span>
                    </div>
                    <span className="bg-(--brand) text-(--brand-foreground) text-xs font-semibold px-3 py-1.5 rounded-md">
                        Enquire Now
                    </span>
                </div>
                <p className="text-foreground font-semibold text-sm mb-1">Heading text looks like this</p>
                <p className="text-muted-foreground text-xs mb-3">
                    Muted body copy, borders, and cards all follow the palette.
                </p>
                <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-(--brand)" />
                    <span className="w-6 h-6 rounded-full bg-secondary border border-border" />
                    <span className="w-6 h-6 rounded-full bg-muted border border-border" />
                </div>
            </div>
        </div>
    )
}

const SettingsPage = () => {
    const { refresh } = useSiteContent()
    const toast = useToast()
    const [form, setForm] = useState(null)
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        api.getSettings().then(setForm)
    }, [])

    if (!form) return <p className="text-muted-foreground text-sm">Loading…</p>

    const update = (key) => (value) => setForm({ ...form, [key]: value })

    const activeThemeId = form.themeId || DEFAULT_THEME_ID
    const activeTheme = getTheme(activeThemeId)

    const onSave = async () => {
        setSaving(true)
        try {
            const saved = await api.updateSettings(form)
            setForm(saved)
            await refresh()
            toast.success("Settings saved")
        } catch (e) {
            toast.error(e.message || "Failed to save settings")
        } finally {
            setSaving(false)
        }
    }

    return (
        <>
            <PageHeader
                title="Site Settings"
                description="Brand name, logo, favicon, footer info, and SEO metadata."
                actions={<Button onClick={onSave} disabled={saving}>{saving ? "Saving…" : "Save"}</Button>}
            />

            <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <ImageUpload label="Logo" value={form.logoUrl} onChange={update("logoUrl")} />
                    <ImageUpload label="Favicon (tab icon)" value={form.faviconUrl} onChange={update("faviconUrl")} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <TextField label="Site Name" value={form.siteName} onChange={update("siteName")} required />
                    <TextField label="Tagline" value={form.siteTagline} onChange={update("siteTagline")} />
                </div>

                {/* ── Appearance ───────────────────────────────────────── */}
                <div className="rounded-2xl border border-border bg-card p-6">
                    <h2 className="text-lg font-bold mb-1">Appearance</h2>
                    <p className="text-muted-foreground text-sm mb-5">
                        The palette for the public site, this portal, and the emails sent to
                        customers — stored on the server, so it's the same for every visitor
                        and device. Nothing changes until you press Save.
                    </p>

                    <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-6">
                        <ThemePicker value={activeThemeId} onChange={update("themeId")} />

                        <div>
                            <p className="text-xs uppercase tracking-[2px] text-muted-foreground mb-2">Preview</p>
                            <ThemePreview
                                themeId={activeThemeId}
                                usesSiteAccent={activeTheme.usesSiteAccent}
                                siteColor={form.themeColor}
                            />
                        </div>
                    </div>

                    <div className="mt-6 pt-5 border-t border-border">
                        <ColorSwatchField label="Brand Color" value={form.themeColor} onChange={update("themeColor")} />
                        <p className="text-xs text-muted-foreground mt-2.5">
                            {activeTheme.usesSiteAccent
                                ? "The “Site Brand” theme is active, so this color is the accent every visitor sees — in the site and in email."
                                : "Only used by the “Site Brand” theme above — the other themes ship their own accent."}
                        </p>
                    </div>
                </div>

                <TextField label="Browser Tab Title" value={form.pageTitle} onChange={update("pageTitle")} />

                <TextArea label="Footer Description" value={form.footerDescription} onChange={update("footerDescription")} rows={3} />

                <TextArea label="Footer Address" value={form.footerAddress} onChange={update("footerAddress")} rows={2} />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <TextField label="Footer Phone" value={form.footerPhone} onChange={update("footerPhone")} />
                    <TextField label="Footer Email" value={form.footerEmail} onChange={update("footerEmail")} type="email" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <TextField label="Copyright Text" value={form.copyrightText} onChange={update("copyrightText")} />
                    <TextField label="Max Reels Allowed" value={form.maxReels} onChange={(v) => update("maxReels")(v === "" ? "" : Number(v))} type="number" />
                </div>
            </div>
        </>
    )
}

export default SettingsPage
