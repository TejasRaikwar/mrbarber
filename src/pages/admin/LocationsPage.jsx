import { useEffect, useState } from "react"
import { Plus, Trash2, X } from "lucide-react"
import { api } from "@/api/client"
import { useSiteContent } from "@/context/SiteContentContext"
import { useToast } from "@/context/ToastContext"
import { extractMapEmbedSrc } from "@/lib/utils"
import { TextField, NumberField, TextArea, Button, PageHeader } from "./components/FormFields"
import ConfirmDialog from "./components/ConfirmDialog"

const blankLocation = () => ({
    city: "",
    mapEmbedUrl: "",
    address: "",
    whatsapp: "",
    contacts: [],
    displayOrder: 0,
    _draft: true,
    _tempId: Date.now()
})

const blankContact = () => ({ label: "", phone: "", _tempId: Date.now() + Math.random() })

const LocationsPage = () => {
    const { refresh } = useSiteContent()
    const toast = useToast()
    const [items, setItems] = useState([])
    const [loading, setLoading] = useState(true)
    const [deleteIdx, setDeleteIdx] = useState(null)
    const [deleting, setDeleting] = useState(false)

    const load = async () => {
        setLoading(true)
        setItems(await api.listAdmin("locations"))
        setLoading(false)
    }

    useEffect(() => { load() }, [])

    const update = (idx, patch) => {
        setItems((prev) => prev.map((it, i) => (i === idx ? { ...it, ...patch } : it)))
    }

    const updateContact = (locIdx, cIdx, patch) => {
        setItems((prev) => prev.map((it, i) => {
            if (i !== locIdx) return it
            const contacts = it.contacts.map((c, j) => (j === cIdx ? { ...c, ...patch } : c))
            return { ...it, contacts }
        }))
    }

    const addContact = (locIdx) => {
        setItems((prev) => prev.map((it, i) =>
            i === locIdx ? { ...it, contacts: [...(it.contacts || []), blankContact()] } : it
        ))
    }

    const removeContact = (locIdx, cIdx) => {
        setItems((prev) => prev.map((it, i) => {
            if (i !== locIdx) return it
            return { ...it, contacts: it.contacts.filter((_, j) => j !== cIdx) }
        }))
    }

    const onSave = async (idx) => {
        const item = items[idx]
        const payload = {
            ...item,
            mapEmbedUrl: extractMapEmbedSrc(item.mapEmbedUrl),
            contacts: (item.contacts || []).map((c) => ({ label: c.label, phone: c.phone, id: c.id }))
        }
        delete payload._draft
        delete payload._tempId
        const isEdit = !!item.id
        try {
            const saved = isEdit
                ? await api.updateAdmin("locations", item.id, payload)
                : await api.createAdmin("locations", payload)
            setItems((prev) => prev.map((it, i) => (i === idx ? saved : it)))
            await refresh()
            toast.success(isEdit ? "Location saved" : "Location created")
        } catch (err) {
            toast.error(err.message || "Failed to save location")
            throw err
        }
    }

    const handleConfirmDelete = async () => {
        if (deleteIdx === null) return
        const item = items[deleteIdx]
        setDeleting(true)
        try {
            if (item?.id) await api.deleteAdmin("locations", item.id)
            setItems((prev) => prev.filter((_, i) => i !== deleteIdx))
            setDeleteIdx(null)
            await refresh()
            toast.success("Location deleted")
        } catch (err) {
            toast.error(err.message || "Failed to delete location")
        } finally {
            setDeleting(false)
        }
    }

    return (
        <>
            <PageHeader
                title="Contact Locations"
                description="Studios shown in the Visit Our Studio section. Each location has multiple phone contacts."
                actions={
                    <Button onClick={() => setItems((p) => [...p, blankLocation()])}>
                        <span className="inline-flex items-center gap-2">
                            <Plus className="w-4 h-4" /> New location
                        </span>
                    </Button>
                }
            />

            {loading ? (
                <p className="text-gray-500 text-sm">Loading…</p>
            ) : items.length === 0 ? (
                <p className="text-gray-500 text-sm">No locations yet.</p>
            ) : (
                <div className="space-y-6">
                    {items.map((loc, idx) => (
                        <LocationEditor
                            key={loc.id ?? loc._tempId}
                            loc={loc}
                            onChange={(patch) => update(idx, patch)}
                            updateContact={(cIdx, patch) => updateContact(idx, cIdx, patch)}
                            addContact={() => addContact(idx)}
                            removeContact={(cIdx) => removeContact(idx, cIdx)}
                            onSave={() => onSave(idx)}
                            onDelete={() => setDeleteIdx(idx)}
                        />
                    ))}
                </div>
            )}

            <ConfirmDialog
                open={deleteIdx !== null}
                onOpenChange={(open) => !open && setDeleteIdx(null)}
                title="Delete Location"
                description="Are you sure you want to delete this location? It will be removed from the public website."
                confirmLabel="Delete"
                variant="danger"
                loading={deleting}
                onConfirm={handleConfirmDelete}
            />
        </>
    )
}

const LocationEditor = ({ loc, onChange, updateContact, addContact, removeContact, onSave, onDelete }) => {
    const [saving, setSaving] = useState(false)

    const doSave = async () => {
        setSaving(true)
        try { await onSave() } catch { /* error already surfaced via toast */ } finally { setSaving(false) }
    }

    return (
        <div className="bg-zinc-900/60 border border-white/10 rounded-2xl p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <TextField label="City" value={loc.city} onChange={(v) => onChange({ city: v })} required />
                <TextField label="WhatsApp (digits, with country code)" value={loc.whatsapp} onChange={(v) => onChange({ whatsapp: v })} />
                <div className="md:col-span-2">
                    <TextArea
                        label="Map embed URL"
                        value={loc.mapEmbedUrl}
                        onChange={(v) => onChange({ mapEmbedUrl: v })}
                        rows={2}
                        placeholder="Paste the Google Maps 'Embed a map' link (or the whole <iframe> snippet)"
                    />
                    <p className="text-xs text-gray-500 mt-1.5">
                        In Google Maps: search the location → Share → Embed a map → Copy HTML, then paste it here (the iframe src is extracted automatically).
                    </p>
                </div>
                <div className="md:col-span-2">
                    <TextArea label="Address (one line per row)" value={loc.address} onChange={(v) => onChange({ address: v })} rows={3} />
                </div>
                <NumberField label="Order" value={loc.displayOrder} onChange={(v) => onChange({ displayOrder: v })} />
            </div>

            <div className="mt-6 pt-5 border-t border-white/5">
                <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm uppercase tracking-[2px] text-gray-500">Phone Contacts</h4>
                    <button
                        onClick={addContact}
                        className="text-xs text-(--brand) hover:text-(--brand-hover) inline-flex items-center gap-1"
                    >
                        <Plus className="w-3 h-3" /> Add contact
                    </button>
                </div>

                <div className="space-y-2">
                    {(loc.contacts || []).map((c, cIdx) => (
                        <div key={c.id ?? c._tempId} className="flex items-center gap-2">
                            <input
                                value={c.label || ""}
                                onChange={(e) => updateContact(cIdx, { label: e.target.value })}
                                placeholder="Label (e.g. Home Trial)"
                                className="flex-1 bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm outline-none"
                            />
                            <input
                                value={c.phone || ""}
                                onChange={(e) => updateContact(cIdx, { phone: e.target.value })}
                                placeholder="+91 ..."
                                className="flex-1 bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm outline-none"
                            />
                            <button
                                onClick={() => removeContact(cIdx)}
                                className="text-gray-500 hover:text-red-400 p-2"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex items-center justify-between mt-6 pt-5 border-t border-white/5">
                <span className="text-xs text-gray-500">{loc.id ? `ID: ${loc.id}` : "Unsaved"}</span>
                <div className="flex gap-3">
                    <Button variant="danger" onClick={onDelete}>
                        <span className="inline-flex items-center gap-2">
                            <Trash2 className="w-4 h-4" /> Delete
                        </span>
                    </Button>
                    <Button onClick={doSave} disabled={saving}>
                        {saving ? "Saving…" : loc.id ? "Save" : "Create"}
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default LocationsPage
