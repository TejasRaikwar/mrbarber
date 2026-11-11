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

                {/* ── Search & sharing ─────────────────────────────────── */}
                <div className="rounded-2xl border border-border bg-card p-6">
                    <h2 className="text-lg font-bold mb-1">Search &amp; Sharing (SEO)</h2>
                    <p className="text-muted-foreground text-sm mb-5">
                        How the home page appears in Google results and in link previews on
                        WhatsApp, Facebook and X. Leave a field blank to use the built-in
                        default. Service and branch pages have their own fixed text.
                    </p>
                    <div className="space-y-5">
                        <TextField
                            label="Home Page Title"
                            value={form.pageTitle}
                            onChange={update("pageTitle")}
                            placeholder="Mr barber Hair Patch in Nagpur"
                        />
                        <div>
                            <TextArea
                                label="Meta Description"
                                value={form.metaDescription}
                                onChange={update("metaDescription")}
                                rows={3}
                            />
                            <p className={`text-xs mt-1.5 ${(form.metaDescription || "").length > 160 ? "text-destructive" : "text-muted-foreground"}`}>
                                {(form.metaDescription || "").length}/160 characters — Google usually cuts off longer text.
                            </p>
                        </div>
                        <ImageUpload label="Share Image (1200×630 works best)" value={form.ogImageUrl} onChange={update("ogImageUrl")} />
                    </div>
                </div>

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

                {/* ── Enquiry emails ──────────────────────────────────── */}
                <div className="rounded-2xl border border-border bg-card p-6">
                    <h2 className="text-lg font-bold mb-1">Enquiry Emails</h2>
                    <p className="text-muted-foreground text-sm mb-5">
                        Customize the two emails sent when someone submits an enquiry: the
                        confirmation the customer receives, and the alert your team gets.
                        Leave blank to use the default wording. Available placeholders:{" "}
                        <code className="text-xs bg-secondary px-1.5 py-0.5 rounded">{"{{customerName}}"}</code>{" "}
                        <code className="text-xs bg-secondary px-1.5 py-0.5 rounded">{"{{brandName}}"}</code>{" "}
                        <code className="text-xs bg-secondary px-1.5 py-0.5 rounded">{"{{email}}"}</code>{" "}
                        <code className="text-xs bg-secondary px-1.5 py-0.5 rounded">{"{{phone}}"}</code>{" "}
                        <code className="text-xs bg-secondary px-1.5 py-0.5 rounded">{"{{address}}"}</code>
                    </p>

                    <div className="space-y-5">
                        <div>
                            <p className="text-sm font-semibold text-foreground mb-3">Customer confirmation</p>
                            <div className="space-y-4">
                                <TextField
                                    label="Subject"
                                    value={form.enquiryCustomerSubject}
                                    onChange={update("enquiryCustomerSubject")}
                                    placeholder="Thank you for contacting {{brandName}}!"
                                />
                                <TextArea
                                    label="Message"
                                    value={form.enquiryCustomerMessage}
                                    onChange={update("enquiryCustomerMessage")}
                                    rows={4}
                                    placeholder="Thank you for reaching out to us! We have successfully received your enquiry, and our team will get in touch with you shortly."
                                />
                            </div>
                        </div>

                        <div className="pt-5 border-t border-border">
                            <p className="text-sm font-semibold text-foreground mb-3">Admin alert</p>
                            <div className="space-y-4">
                                <TextField
                                    label="Subject"
                                    value={form.enquiryAdminSubject}
                                    onChange={update("enquiryAdminSubject")}
                                    placeholder="🔔 New Customer Enquiry: {{customerName}}"
                                />
                                <TextField
                                    label="Intro line"
                                    value={form.enquiryAdminIntro}
                                    onChange={update("enquiryAdminIntro")}
                                    placeholder="A new customer enquiry was submitted on {{brandName}}"
                                />
                                <p className="text-xs text-muted-foreground">
                                    The submitted details table (name, email, mobile, address / location, time) is always included below the intro line.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default SettingsPage
