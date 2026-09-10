import { useEffect, useState } from "react"
import { Dialog } from "radix-ui"
import { format } from "date-fns"
import {
    Plus, Trash2, X, User, ShieldCheck, Pencil, Upload,
    Mail, Phone, MapPin, CalendarIcon, FileText, IndianRupee, KeyRound
} from "lucide-react"
import { api } from "@/api/client"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useToast } from "@/context/ToastContext"
import { PageHeader, Button } from "./components/FormFields"
import ConfirmDialog from "./components/ConfirmDialog"

/* ─── Utilities ─────────────────────────────────────────────────────────── */
const calcAge = (dobStr) => {
    if (!dobStr) return null
    const dob = new Date(dobStr + "T00:00:00")
    if (isNaN(dob.getTime())) return null
    const now = new Date()
    let age = now.getFullYear() - dob.getFullYear()
    const m = now.getMonth() - dob.getMonth()
    if (m < 0 || (m === 0 && now.getDate() < dob.getDate())) age--
    return age
}

const EMPTY = {
    displayName: "", username: "", password: "", confirm: "",
    phone: "", alternatePhone: "", email: "", dob: "",
    identityProofUrl: "", address: "", salary: ""
}

const fromStaff = (s) => ({
    displayName: s.displayName ?? "",
    username: s.username ?? "",
    password: "", confirm: "",
    phone: s.phone ?? "",
    alternatePhone: s.alternatePhone ?? "",
    email: s.email ?? "",
    dob: s.dob ?? "",
    identityProofUrl: s.identityProofUrl ?? "",
    address: s.address ?? "",
    salary: s.salary != null ? String(s.salary) : ""
})

/* ─── DOB picker (Calendar in popover) ──────────────────────────────────── */
const DobPicker = ({ value, onChange }) => {
    const [open, setOpen] = useState(false)
    const selected = value ? new Date(value + "T00:00:00") : undefined
    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <button type="button" className={`${inp} flex items-center justify-between`}>
                    <span className={selected ? "text-foreground" : "text-muted-foreground"}>
                        {selected ? format(selected, "dd MMM yyyy") : "Pick date of birth"}
                    </span>
                    <CalendarIcon className="w-4 h-4 text-muted-foreground shrink-0" />
                </button>
            </PopoverTrigger>
            <PopoverContent align="start" style={{ backgroundColor: "#18181b" }}
                className="w-auto p-0 border-border z-200">
                <div className="text-foreground">
                    <Calendar mode="single" selected={selected} autoFocus
                        captionLayout="dropdown"
                        startMonth={new Date(1950, 0)}
                        endMonth={new Date()}
                        className="bg-card!"
                        classNames={{
                            weekday:  "flex-1 rounded-md text-[0.8rem] font-normal text-muted-foreground select-none",
                            outside:  "text-muted-foreground/60",
                            disabled: "opacity-25",
                            today:    "rounded-md bg-secondary text-foreground data-[selected=true]:rounded-none",
                        }}
                        onSelect={(d) => {
                            if (d) {
                                const y = d.getFullYear()
                                const m = String(d.getMonth() + 1).padStart(2, "0")
                                const day = String(d.getDate()).padStart(2, "0")
                                onChange(`${y}-${m}-${day}`)
                            }
                            setOpen(false)
                        }}
                    />
                </div>
            </PopoverContent>
        </Popover>
    )
}

/* ─── Identity proof file upload (image or PDF) ─────────────────────────── */
const IdentityProofUpload = ({ value, onChange }) => {
    const [uploading, setUploading] = useState(false)
    const [error, setError] = useState(null)

    const onFile = async (e) => {
        const file = e.target.files?.[0]
        if (!file) return
        setUploading(true); setError(null)
        try {
            const res = await api.uploadFile(file)
            onChange(res.url)
        } catch (err) {
            setError(err.message || "Upload failed")
        } finally {
            setUploading(false)
            e.target.value = ""
        }
    }

    const isImage = value && /\.(jpe?g|png|gif|webp)$/i.test(value)

    return (
        <div className="flex items-center gap-3">
            <div className="w-20 h-20 rounded-lg border border-border bg-background flex items-center justify-center overflow-hidden shrink-0">
                {value ? (
                    isImage
                        ? <img src={value} alt="ID" className="w-full h-full object-cover" />
                        : <FileText className="w-7 h-7 text-(--brand)" />
                ) : (
                    <FileText className="w-6 h-6 text-muted-foreground/70" />
                )}
            </div>
            <div className="flex-1 min-w-0">
                <label className="inline-flex items-center gap-2 cursor-pointer bg-muted hover:bg-accent border border-border px-3 py-2 rounded-lg text-sm">
                    <Upload className="w-4 h-4" />
                    {uploading ? "Uploading…" : value ? "Replace" : "Upload"}
                    <input type="file" accept="image/*,application/pdf"
                        className="hidden" onChange={onFile} disabled={uploading} />
                </label>
                {value && (
                    <>
                        <a href={value} target="_blank" rel="noreferrer"
                            className="ml-3 text-xs text-(--brand) hover:underline">View</a>
                        <button type="button" onClick={() => onChange("")}
                            className="ml-2 text-xs text-muted-foreground hover:text-red-600 transition-colors">
                            Remove
                        </button>
                    </>
                )}
                {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
            </div>
        </div>
    )
}

/* ─── Staff form (shared by create + edit) ──────────────────────────────── */
const StaffForm = ({ form, set, isEdit }) => {
    const age = calcAge(form.dob)
    return (
        <div className="space-y-5">
            {/* Account credentials */}
            <SectionTitle>Account</SectionTitle>
            <div className="grid grid-cols-2 gap-4">
                <Field label="Full Name" required>
                    <input type="text" value={form.displayName} required
                        onChange={(e) => set("displayName")(e.target.value)}
                        placeholder="e.g. Rahul Sharma" className={inp} />
                </Field>
                <Field label="Username" required>
                    <input type="text" value={form.username} required
                        onChange={(e) => set("username")(e.target.value)}
                        placeholder="login id" className={inp} />
                </Field>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <Field label={isEdit ? "New Password (leave blank to keep)" : "Password"} required={!isEdit}>
                    <input type="password" value={form.password}
                        onChange={(e) => set("password")(e.target.value)}
                        placeholder="Min. 6 characters" className={inp} />
                </Field>
                <Field label="Confirm Password" required={!isEdit || form.password.length > 0}>
                    <input type="password" value={form.confirm}
                        onChange={(e) => set("confirm")(e.target.value)}
                        placeholder="Repeat password" className={inp} />
                </Field>
            </div>

            {/* Contact */}
            <SectionTitle>Contact</SectionTitle>
            <div className="grid grid-cols-2 gap-4">
                <Field label="Mobile Number" required>
                    <input type="tel" value={form.phone} required
                        onChange={(e) => set("phone")(e.target.value)}
                        placeholder="+91 00000 00000" className={inp} />
                </Field>
                <Field label="Alternate Mobile">
                    <input type="tel" value={form.alternatePhone}
                        onChange={(e) => set("alternatePhone")(e.target.value)}
                        placeholder="Optional" className={inp} />
                </Field>
            </div>
            <Field label="Email">
                <input type="email" value={form.email}
                    onChange={(e) => set("email")(e.target.value)}
                    placeholder="name@example.com" className={inp} />
            </Field>
            <Field label="Address">
                <textarea value={form.address} rows={2}
                    onChange={(e) => set("address")(e.target.value)}
                    placeholder="Residential address"
                    className={`${inp} resize-y`} />
            </Field>

            {/* Personal */}
            <SectionTitle>Personal & Employment</SectionTitle>
            <div className="grid grid-cols-2 gap-4">
                <Field label="Date of Birth">
                    <DobPicker value={form.dob} onChange={set("dob")} />
                </Field>
                <Field label="Age">
                    <div className={`${inp} flex items-center text-muted-foreground`}>
                        {age != null ? `${age} years` : "Auto-calculated"}
                    </div>
                </Field>
            </div>
            <Field label="Identity Proof (image or PDF)">
                <IdentityProofUpload value={form.identityProofUrl} onChange={set("identityProofUrl")} />
            </Field>
            <Field label="Salary (₹ / month)">
                <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">₹</span>
                    <input type="number" min="0" step="0.01" value={form.salary}
                        onChange={(e) => set("salary")(e.target.value)}
                        placeholder="Monthly salary"
                        className={`${inp} pl-7`} />
                </div>
            </Field>
        </div>
    )
}

/* ─── Create / Edit Dialog ──────────────────────────────────────────────── */
const StaffDialog = ({ staff = null, onSaved, trigger }) => {
    const isEdit = !!staff
    const toast = useToast()
    const [open, setOpen] = useState(false)
    const [form, setForm] = useState(EMPTY)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState(null)

    const set = (k) => (v) => setForm((f) => ({ ...f, [k]: v }))

    const handleOpen = (v) => {
        setOpen(v)
        if (v) {
            setForm(isEdit ? fromStaff(staff) : EMPTY)
            setError(null)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (form.password || !isEdit) {
            if (form.password !== form.confirm) { setError("Passwords don't match."); return }
            if (form.password.length < 6) { setError("Password must be at least 6 characters."); return }
        }

        setSaving(true); setError(null)
        try {
            const payload = {
                username: form.username,
                password: form.password || null,
                displayName: form.displayName,
                phone: form.phone,
                alternatePhone: form.alternatePhone,
                email: form.email,
                dob: form.dob || null,
                identityProofUrl: form.identityProofUrl,
                address: form.address,
                salary: form.salary !== "" ? form.salary : null
            }
            const saved = isEdit
                ? await api.updateStaff(staff.id, payload)
                : await api.createStaff(payload)
            onSaved(saved, isEdit)
            setOpen(false)
            toast.success(isEdit ? "Staff member updated" : "Staff member added")
        } catch (err) {
            setError(err.message || "Failed to save staff.")
        } finally {
            setSaving(false)
        }
    }

    return (
        <Dialog.Root open={open} onOpenChange={handleOpen}>
            <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 z-50 bg-foreground/40 backdrop-blur-sm data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0" />
                <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 bg-card border border-border rounded-2xl p-8 shadow-lg data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 max-h-[90vh] overflow-y-auto">
                    <Dialog.Title className="text-foreground font-bold text-xl mb-1">
                        {isEdit ? "Edit Staff Member" : "Add Staff Member"}
                    </Dialog.Title>
                    <Dialog.Description className="text-muted-foreground text-sm mb-6">
                        {isEdit
                            ? "Update profile, contact, and employment details."
                            : "Create a staff account. They'll log in with these credentials."}
                    </Dialog.Description>

                    <form onSubmit={handleSubmit}>
                        <StaffForm form={form} set={set} isEdit={isEdit} />

                        {error && <p className="text-red-600 text-sm mt-4">{error}</p>}

                        <div className="flex justify-end gap-3 mt-6 pt-5 border-t border-border/60">
                            <Dialog.Close asChild>
                                <Button variant="ghost">Cancel</Button>
                            </Dialog.Close>
                            <Button type="submit" disabled={saving}>
                                {saving ? "Saving…" : isEdit ? "Save Changes" : "Create Staff"}
                            </Button>
                        </div>
                    </form>

                    <Dialog.Close asChild>
                        <button className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </Dialog.Close>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    )
}

/* ─── Staff Card ────────────────────────────────────────────────────────── */
const StaffCard = ({ s, onUpdated, onDelete }) => {
    const age = calcAge(s.dob)
    return (
        <div className="bg-card border border-border rounded-2xl p-6">
            <div className="flex items-start justify-between gap-4 mb-5">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-(--brand)/10 flex items-center justify-center shrink-0">
                        <User className="w-6 h-6 text-(--brand)" />
                    </div>
                    <div>
                        <p className="text-foreground font-semibold text-lg leading-tight">{s.displayName}</p>
                        <p className="text-muted-foreground text-sm flex items-center gap-1.5">
                            <KeyRound className="w-3 h-3" /> @{s.username}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1.5 text-xs text-emerald-600 bg-emerald-400/10 px-2.5 py-1 rounded-full">
                        <ShieldCheck className="w-3 h-3" /> Staff
                    </span>
                    <StaffDialog
                        staff={s}
                        onSaved={(updated) => onUpdated(updated)}
                        trigger={
                            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:border-foreground/25 text-xs font-medium transition-colors">
                                <Pencil className="w-3.5 h-3.5" /> Edit
                            </button>
                        }
                    />
                    <button onClick={() => onDelete(s.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-500/20 text-red-600/70 hover:text-red-600 hover:border-red-500/40 text-xs font-medium transition-colors">
                        <Trash2 className="w-3.5 h-3.5" /> Remove
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <Info icon={<Phone className="w-3.5 h-3.5" />} label="Mobile" value={s.phone} />
                <Info icon={<Phone className="w-3.5 h-3.5" />} label="Alt. Mobile" value={s.alternatePhone} />
                <Info icon={<Mail className="w-3.5 h-3.5" />} label="Email" value={s.email} />
                <Info icon={<IndianRupee className="w-3.5 h-3.5" />} label="Salary"
                    value={s.salary != null ? `₹${Number(s.salary).toLocaleString("en-IN")}` : null}
                    accent />
                <Info icon={<CalendarIcon className="w-3.5 h-3.5" />} label="DOB"
                    value={s.dob ? format(new Date(s.dob + "T00:00:00"), "dd MMM yyyy") : null} />
                <Info icon={<User className="w-3.5 h-3.5" />} label="Age"
                    value={age != null ? `${age} years` : null} />
                <Info icon={<MapPin className="w-3.5 h-3.5" />} label="Address" value={s.address} wide />
                <Info icon={<FileText className="w-3.5 h-3.5" />} label="ID Proof"
                    value={s.identityProofUrl
                        ? <a href={s.identityProofUrl} target="_blank" rel="noreferrer"
                            className="text-(--brand) hover:underline">View document</a>
                        : null} />
            </div>
        </div>
    )
}

const Info = ({ icon, label, value, accent, wide }) => (
    <div className={wide ? "col-span-2" : ""}>
        <p className="text-xs uppercase tracking-[1.5px] text-muted-foreground mb-1 flex items-center gap-1.5">
            {icon}{label}
        </p>
        <p className={`text-sm ${value ? (accent ? "text-(--brand) font-medium" : "text-foreground") : "text-muted-foreground/70 italic"}`}>
            {value || "—"}
        </p>
    </div>
)

/* ─── Page ──────────────────────────────────────────────────────────────── */
const StaffPage = () => {
    const toast = useToast()
    const [staff, setStaff] = useState([])
    const [loading, setLoading] = useState(true)
    const [deleteId, setDeleteId] = useState(null)
    const [deleting, setDeleting] = useState(false)

    useEffect(() => {
        api.listStaff().then((data) => { setStaff(data); setLoading(false) })
    }, [])

    const handleSaved = (saved, isEdit) => {
        setStaff((prev) =>
            isEdit ? prev.map((s) => (s.id === saved.id ? saved : s)) : [...prev, saved]
        )
    }

    const handleConfirmDelete = async () => {
        if (!deleteId) return
        setDeleting(true)
        try {
            await api.deleteStaff(deleteId)
            setStaff((prev) => prev.filter((s) => s.id !== deleteId))
            setDeleteId(null)
            toast.success("Staff member removed")
        } catch (err) {
            toast.error(err.message || "Failed to remove staff member")
        } finally {
            setDeleting(false)
        }
    }

    return (
        <>
            <PageHeader
                title="Staff"
                description="Manage staff accounts, contact details, and salaries."
                actions={
                    <StaffDialog
                        onSaved={(saved) => handleSaved(saved, false)}
                        trigger={
                            <Button>
                                <span className="inline-flex items-center gap-2">
                                    <Plus className="w-4 h-4" /> Add Staff
                                </span>
                            </Button>
                        }
                    />
                }
            />

            {loading ? (
                <p className="text-muted-foreground text-sm">Loading…</p>
            ) : staff.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-(--brand)/10 flex items-center justify-center mb-5">
                        <User className="w-8 h-8 text-(--brand)" />
                    </div>
                    <h2 className="text-foreground font-semibold text-lg mb-2">No staff yet</h2>
                    <p className="text-muted-foreground text-sm max-w-xs">
                        Add staff members so they can log in and manage appointments.
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {staff.map((s) => (
                        <StaffCard key={s.id} s={s} onUpdated={(u) => handleSaved(u, true)} onDelete={(id) => setDeleteId(id)} />
                    ))}
                </div>
            )}

            <ConfirmDialog
                open={!!deleteId}
                onOpenChange={(open) => !open && setDeleteId(null)}
                title="Remove Staff Member"
                description="Are you sure you want to remove this staff account? They will no longer be able to log in."
                confirmLabel="Remove"
                variant="danger"
                loading={deleting}
                onConfirm={handleConfirmDelete}
            />
        </>
    )
}

const inp = "w-full bg-muted border border-border focus:border-(--brand)/50 rounded-lg px-3 py-2.5 outline-none text-foreground text-sm"
const Field = ({ label, required, children }) => (
    <div>
        <label className="block text-xs uppercase tracking-[2px] text-muted-foreground mb-1.5 font-medium">
            {label}{required && <span className="text-(--brand) ml-1">*</span>}
        </label>
        {children}
    </div>
)
const SectionTitle = ({ children }) => (
    <p className="text-xs uppercase tracking-[2px] text-(--brand) font-semibold pt-1">{children}</p>
)

export default StaffPage
