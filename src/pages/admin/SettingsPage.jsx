import { useEffect, useState } from "react"
import { api } from "@/api/client"
import { useSiteContent } from "@/context/SiteContentContext"
import { TextField, TextArea, Button, PageHeader } from "./components/FormFields"
import ImageUpload from "./components/ImageUpload"

const SettingsPage = () => {
    const { refresh } = useSiteContent()
    const [form, setForm] = useState(null)
    const [saving, setSaving] = useState(false)
    const [message, setMessage] = useState(null)

    useEffect(() => {
        api.getSettings().then(setForm)
    }, [])

    if (!form) return <p className="text-gray-500 text-sm">Loading…</p>

    const update = (key) => (value) => setForm({ ...form, [key]: value })

    const onSave = async () => {
        setSaving(true)
        setMessage(null)
        try {
            const saved = await api.updateSettings(form)
            setForm(saved)
            await refresh()
            setMessage("Saved")
        } catch (e) {
            setMessage(e.message || "Save failed")
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

                <TextField label="Browser Tab Title" value={form.pageTitle} onChange={update("pageTitle")} />

                <TextArea label="Footer Description" value={form.footerDescription} onChange={update("footerDescription")} rows={3} />

                <TextArea label="Footer Address" value={form.footerAddress} onChange={update("footerAddress")} rows={2} />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <TextField label="Footer Phone" value={form.footerPhone} onChange={update("footerPhone")} />
                    <TextField label="Footer Email" value={form.footerEmail} onChange={update("footerEmail")} type="email" />
                </div>

                <TextField label="Copyright Text" value={form.copyrightText} onChange={update("copyrightText")} />

                {message && <p className="text-yellow-500 text-sm">{message}</p>}
            </div>
        </>
    )
}

export default SettingsPage
