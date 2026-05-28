import { useEffect, useState } from "react"
import { Plus, Trash2 } from "lucide-react"
import { api } from "@/api/client"
import { useSiteContent } from "@/context/SiteContentContext"
import { TextField, NumberField, TextArea, Button, PageHeader } from "./components/FormFields"
import ImageUpload from "./components/ImageUpload"

/**
 * Generic CRUD page driven by a schema describing each editable field.
 *
 * schema = {
 *   resource: "services",     // path under /api/admin
 *   title, description,
 *   defaults: { ... },        // shape of a fresh row
 *   fields: [
 *     { key, label, type: "text"|"textarea"|"number"|"image", required?, placeholder? }
 *   ]
 * }
 */
const CrudPage = ({ schema }) => {
    const { refresh, navLinks } = useSiteContent()
    const [items, setItems] = useState([])
    const [loading, setLoading] = useState(true)

    const load = async () => {
        setLoading(true)
        const data = await api.listAdmin(schema.resource)
        setItems(data)
        setLoading(false)
    }

    useEffect(() => {
        load()
    }, [schema.resource])

    const addNew = () => {
        setItems((prev) => [
            ...prev,
            { ...schema.defaults, _draft: true, _tempId: Date.now() }
        ])
    }

    const onChange = (idx, key, value) => {
        setItems((prev) => prev.map((it, i) => (i === idx ? { ...it, [key]: value } : it)))
    }

    const onSave = async (idx) => {
        const item = items[idx]
        const payload = { ...item }
        delete payload._draft
        delete payload._tempId
        const saved = item.id
            ? await api.updateAdmin(schema.resource, item.id, payload)
            : await api.createAdmin(schema.resource, payload)
        setItems((prev) => prev.map((it, i) => (i === idx ? saved : it)))
        await refresh()
    }

    const onDelete = async (idx) => {
        const item = items[idx]
        if (!confirm("Delete this item?")) return
        if (item.id) {
            await api.deleteAdmin(schema.resource, item.id)
        }
        setItems((prev) => prev.filter((_, i) => i !== idx))
        await refresh()
    }

    return (
        <>
            <PageHeader
                title={schema.title}
                description={schema.description}
                actions={
                    <Button onClick={addNew}>
                        <span className="inline-flex items-center gap-2">
                            <Plus className="w-4 h-4" />
                            New
                        </span>
                    </Button>
                }
            />

            {loading ? (
                <p className="text-gray-500 text-sm">Loading…</p>
            ) : items.length === 0 ? (
                <p className="text-gray-500 text-sm">No items yet. Click "New" to add one.</p>
            ) : (
                <div className="space-y-4">
                    {items.map((item, idx) => (
                        <ItemEditor
                            key={item.id ?? item._tempId}
                            schema={schema}
                            item={item}
                            navLinks={navLinks}
                            onChange={(key, value) => onChange(idx, key, value)}
                            onSave={() => onSave(idx)}
                            onDelete={() => onDelete(idx)}
                        />
                    ))}
                </div>
            )}
        </>
    )
}

const ItemEditor = ({ schema, item, navLinks, onChange, onSave, onDelete }) => {
    const [saving, setSaving] = useState(false)
    const [savedAt, setSavedAt] = useState(null)

    const doSave = async () => {
        setSaving(true)
        try {
            await onSave()
            setSavedAt(Date.now())
        } finally {
            setSaving(false)
        }
    }

    return (
        <div className="bg-zinc-900/60 border border-white/10 rounded-2xl p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {schema.fields.map((f) => (
                    <div key={f.key} className={f.fullWidth ? "md:col-span-2" : ""}>
                        {f.type === "text" && (
                            <TextField
                                label={f.label}
                                value={item[f.key]}
                                onChange={(v) => onChange(f.key, v)}
                                required={f.required}
                                placeholder={f.placeholder}
                            />
                        )}
                        {f.type === "number" && (
                            <NumberField
                                label={f.label}
                                value={item[f.key]}
                                onChange={(v) => onChange(f.key, v)}
                                min={f.min}
                                max={f.max}
                                step={f.step}
                            />
                        )}
                        {f.type === "textarea" && (
                            <TextArea
                                label={f.label}
                                value={item[f.key]}
                                onChange={(v) => onChange(f.key, v)}
                                rows={f.rows}
                                placeholder={f.placeholder}
                            />
                        )}
                        {f.type === "image" && (
                            <ImageUpload
                                label={f.label}
                                value={item[f.key]}
                                onChange={(v) => onChange(f.key, v)}
                            />
                        )}
                        {f.type === "navlink-select" && (
                            <div>
                                <label className="block text-xs uppercase tracking-[2px] text-gray-500 mb-2">{f.label}</label>
                                <select
                                    value={item[f.key] ?? ""}
                                    onChange={(e) => onChange(f.key, e.target.value)}
                                    className="w-full bg-zinc-900 border border-white/10 focus:border-yellow-500/50 rounded-lg px-3 py-2.5 outline-none text-white"
                                >
                                    <option value="">— none —</option>
                                    {(navLinks || []).map((nl) => (
                                        <option key={nl.id ?? nl.label} value={nl.hash}>
                                            {nl.label} {nl.hash ? `(#${nl.hash})` : "(top)"}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <div className="flex items-center justify-between mt-6 pt-5 border-t border-white/5">
                <span className="text-xs text-gray-500">
                    {item.id ? `ID: ${item.id}` : "Unsaved"}
                    {savedAt && " · Saved"}
                </span>
                <div className="flex items-center gap-3">
                    <Button variant="danger" onClick={onDelete}>
                        <span className="inline-flex items-center gap-2">
                            <Trash2 className="w-4 h-4" />
                            Delete
                        </span>
                    </Button>
                    <Button onClick={doSave} disabled={saving}>
                        {saving ? "Saving…" : item.id ? "Save" : "Create"}
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default CrudPage
