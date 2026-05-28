import { useEffect, useState, useMemo } from "react"
import { Dialog } from "radix-ui"
import { format } from "date-fns"
import {
    CalendarIcon, Plus, Trash2, X, Pencil, Clock,
    CalendarDays, IndianRupee, Scissors
} from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { api } from "@/api/client"
import { useSiteContent } from "@/context/SiteContentContext"
import { PageHeader, Button } from "./components/FormFields"

const EXTRA_SERVICES = ["Maintenance"]
const CUSTOM_KEY = "__custom__"
const HOURS_12 = Array.from({ length: 12 }, (_, i) => String(i + 1))
const MINUTES = ["00", "15", "30", "45"]

const FILTERS = [
    { key: "today", label: "Today" },
    { key: "week",  label: "This Week" },
    { key: "month", label: "This Month" },
]

/* ─── Date helpers ───────────────────────────────────────────────────────── */
const filterCutoff = (key) => {
    const d = new Date(); d.setHours(0, 0, 0, 0)
    if (key === "today") return d
    if (key === "week")  { d.setDate(d.getDate() - 6); return d }
    d.setDate(d.getDate() - 29); return d
}

const dayLabel = (dateStr) => {
    const today = new Date(); today.setHours(0, 0, 0, 0)
    const yesterday = new Date(today); yesterday.setDate(today.getDate() - 1)
    const target = new Date(dateStr + "T00:00:00"); target.setHours(0, 0, 0, 0)
    if (target.getTime() === today.getTime()) return "Today"
    if (target.getTime() === yesterday.getTime()) return "Yesterday"
    return target.toLocaleDateString("en-IN", { weekday: "short", day: "2-digit", month: "short", year: "numeric" })
}

const fmtTime = (timeStr) => {
    if (!timeStr || typeof timeStr !== "string") return ""
    const [h, m] = timeStr.split(":").map(Number)
    if (isNaN(h)) return ""
    const ampm = h >= 12 ? "PM" : "AM"
    const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h
    return `${h12}:${String(m).padStart(2, "0")} ${ampm}`
}

/* ─── Form helpers ───────────────────────────────────────────────────────── */
const defaultForm = () => {
    const now = new Date()
    const y = now.getFullYear()
    const mo = String(now.getMonth() + 1).padStart(2, "0")
    const d  = String(now.getDate()).padStart(2, "0")
    const h  = String(now.getHours()).padStart(2, "0")
    const nearestMin = MINUTES.reduce((best, opt) =>
        Math.abs(parseInt(opt) - now.getMinutes()) < Math.abs(parseInt(best) - now.getMinutes()) ? opt : best
    )
    return { clientName: "", phone: "", service: "", customService: "",
             appointmentDate: `${y}-${mo}-${d}`, appointmentTime: `${h}:${nearestMin}`, amount: "" }
}

const apptToForm = (appt, serviceOptions) => {
    const isCustom = !serviceOptions.includes(appt.service)
    return {
        clientName:      appt.clientName ?? "",
        phone:           appt.phone ?? "",
        service:         isCustom ? CUSTOM_KEY : (appt.service ?? ""),
        customService:   isCustom ? (appt.service ?? "") : "",
        appointmentDate: appt.appointmentDate ?? "",
        appointmentTime: appt.appointmentTime ? appt.appointmentTime.slice(0, 5) : "",
        amount:          appt.amount != null ? String(appt.amount) : ""
    }
}

/* ─── Live Clock ─────────────────────────────────────────────────────────── */
const LiveClock = () => {
    const [now, setNow] = useState(new Date())
    useEffect(() => {
        const id = setInterval(() => setNow(new Date()), 1000)
        return () => clearInterval(id)
    }, [])
    return (
        <div className="flex items-center gap-2.5 bg-zinc-900 border border-white/10 rounded-xl px-4 py-2.5">
            <Clock className="w-4 h-4 text-yellow-500 shrink-0" />
            <div className="text-right">
                <p className="text-white font-semibold text-sm leading-tight tabular-nums">
                    {now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                </p>
                <p className="text-gray-500 text-xs leading-tight">
                    {now.toLocaleDateString("en-IN", { weekday: "short", day: "2-digit", month: "short", year: "numeric" })}
                </p>
            </div>
        </div>
    )
}

/* ─── Date Picker ────────────────────────────────────────────────────────── */
const DatePicker = ({ value, onChange }) => {
    const [open, setOpen] = useState(false)
    const selected = value ? new Date(value + "T00:00:00") : undefined
    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <button type="button" className={`${inputCls} flex items-center justify-between`}>
                    <span className={selected ? "text-white" : "text-gray-500"}>
                        {selected ? format(selected, "dd MMM yyyy") : "Pick a date"}
                    </span>
                    <CalendarIcon className="w-4 h-4 text-gray-500 shrink-0" />
                </button>
            </PopoverTrigger>
            <PopoverContent align="start" style={{ backgroundColor: "#18181b" }}
                className="w-auto p-0 border-white/10 z-200">
                <div className="text-white">
                    <Calendar mode="single" selected={selected} autoFocus
                        className="bg-zinc-900!"
                        classNames={{
                            weekday: "flex-1 rounded-md text-[0.8rem] font-normal text-gray-500 select-none",
                            outside: "text-white/25", disabled: "opacity-25",
                            today:   "rounded-md bg-zinc-700 text-white data-[selected=true]:rounded-none",
                        }}
                        onSelect={(date) => {
                            if (date) {
                                const y = date.getFullYear()
                                const m = String(date.getMonth() + 1).padStart(2, "0")
                                const d = String(date.getDate()).padStart(2, "0")
                                onChange(`${y}-${m}-${d}`)
                            }
                            setOpen(false)
                        }}
                    />
                </div>
            </PopoverContent>
        </Popover>
    )
}

/* ─── Time Picker (12-hour) ──────────────────────────────────────────────── */
const to12 = (val24) => {
    if (!val24 || typeof val24 !== "string") return { hh: "", mm: "", ampm: "AM" }
    const [h, m] = val24.split(":")
    const hour = parseInt(h, 10)
    if (isNaN(hour)) return { hh: "", mm: "", ampm: "AM" }
    return { hh: String(hour === 0 ? 12 : hour > 12 ? hour - 12 : hour), mm: m ?? "00", ampm: hour >= 12 ? "PM" : "AM" }
}
const to24 = (hh, mm, ampm) => {
    if (!hh || !mm) return ""
    let h = parseInt(hh, 10)
    if (ampm === "AM" && h === 12) h = 0
    else if (ampm === "PM" && h !== 12) h += 12
    return `${String(h).padStart(2, "0")}:${mm}`
}

const TimePicker = ({ value, onChange }) => {
    const { hh, mm, ampm } = to12(value)
    const setAmPm = (next) => { const t = to24(hh || "12", mm || "00", next); if (t) onChange(t) }
    return (
        <div className="flex items-center gap-2">
            <select value={hh} className={`${inputCls} w-20 text-center px-2`}
                onChange={(e) => { const t = to24(e.target.value, mm || "00", ampm); if (t) onChange(t) }}>
                <option value="">--</option>
                {HOURS_12.map((h) => <option key={h} value={h}>{h}</option>)}
            </select>
            <span className="text-gray-400 font-bold shrink-0">:</span>
            <select value={mm} className={`${inputCls} w-20 text-center px-2`}
                onChange={(e) => { const t = to24(hh || "12", e.target.value, ampm); if (t) onChange(t) }}>
                <option value="">--</option>
                {MINUTES.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
            <div className="flex items-center bg-zinc-800 border border-white/10 rounded-lg p-0.5 ml-1">
                {["AM", "PM"].map((opt) => (
                    <button key={opt} type="button" onClick={() => setAmPm(opt)}
                        className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${ampm === opt ? "bg-yellow-500 text-black" : "text-gray-400 hover:text-white"}`}>
                        {opt}
                    </button>
                ))}
            </div>
        </div>
    )
}

/* ─── Appointment Form ───────────────────────────────────────────────────── */
const ApptFormFields = ({ form, set, serviceOptions }) => (
    <div className="space-y-5">
        <div className="grid grid-cols-2 gap-5">
            <Field label="Client Name" required>
                <input type="text" value={form.clientName} required placeholder="Full name"
                    onChange={(e) => set("clientName")(e.target.value)} className={inputCls} />
            </Field>
            <Field label="Mobile Number" required>
                <input type="tel" value={form.phone} required placeholder="+91 00000 00000"
                    onChange={(e) => set("phone")(e.target.value)} className={inputCls} />
            </Field>
        </div>
        <Field label="Service" required>
            <select value={form.service} required className={inputCls}
                onChange={(e) => set("service")(e.target.value)}>
                <option value="">— Select a service —</option>
                {serviceOptions.map((s) => <option key={s} value={s}>{s}</option>)}
                <option value={CUSTOM_KEY}>Custom…</option>
            </select>
        </Field>
        {form.service === CUSTOM_KEY && (
            <Field label="Custom Service" required>
                <input type="text" value={form.customService} required placeholder="Describe the service"
                    onChange={(e) => set("customService")(e.target.value)} className={inputCls} />
            </Field>
        )}
        <div className="grid grid-cols-2 gap-5">
            <Field label="Date" required>
                <DatePicker value={form.appointmentDate} onChange={set("appointmentDate")} />
            </Field>
            <Field label="Time">
                <TimePicker value={form.appointmentTime} onChange={set("appointmentTime")} />
            </Field>
        </div>
        <Field label="Amount (₹) — optional">
            <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">₹</span>
                <input type="number" min="0" step="0.01" value={form.amount}
                    onChange={(e) => set("amount")(e.target.value)}
                    placeholder="Leave blank to fill later" className={`${inputCls} pl-7`} />
            </div>
        </Field>
    </div>
)

/* ─── Dialog ─────────────────────────────────────────────────────────────── */
const AppointmentDialog = ({ appointment = null, serviceOptions, onSaved, trigger }) => {
    const isEdit = !!appointment
    const [open, setOpen] = useState(false)
    const [form, setForm] = useState(defaultForm)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState(null)

    const set = (key) => (val) => setForm((f) => ({ ...f, [key]: val }))

    const handleOpen = (v) => {
        setOpen(v)
        if (v) { setForm(isEdit ? apptToForm(appointment, serviceOptions) : defaultForm()); setError(null) }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!form.appointmentDate) { setError("Please select a date."); return }
        setSaving(true); setError(null)
        try {
            const [th, tm] = form.appointmentTime ? form.appointmentTime.split(":") : [null, null]
            const payload = {
                clientName:      form.clientName,
                phone:           form.phone,
                service:         form.service === CUSTOM_KEY ? form.customService : form.service,
                appointmentDate: form.appointmentDate,
                appointmentTime: th && tm ? `${th}:${tm}:00` : null,
                amount:          form.amount !== "" ? form.amount : null
            }
            const saved = isEdit
                ? await api.updateAppointment(appointment.id, payload)
                : await api.createAppointment(payload)
            onSaved(saved, isEdit)
            setOpen(false)
        } catch { setError("Failed to save. Please try again.") }
        finally { setSaving(false) }
    }

    return (
        <Dialog.Root open={open} onOpenChange={handleOpen}>
            <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0" />
                <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 bg-zinc-900 border border-white/10 rounded-2xl p-8 shadow-2xl data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 max-h-[90vh] overflow-y-auto">
                    <Dialog.Title className="text-white font-bold text-xl mb-1">
                        {isEdit ? "Edit Appointment" : "New Appointment"}
                    </Dialog.Title>
                    <Dialog.Description className="text-gray-400 text-sm mb-6">
                        {isEdit ? "Update the appointment details below." : "Fill in the details. Amount can be added later."}
                    </Dialog.Description>
                    <form onSubmit={handleSubmit}>
                        <ApptFormFields form={form} set={set} serviceOptions={serviceOptions} />
                        {error && <p className="text-red-400 text-sm mt-4">{error}</p>}
                        <div className="flex justify-end gap-3 mt-6 pt-5 border-t border-white/5">
                            <Dialog.Close asChild><Button variant="ghost">Cancel</Button></Dialog.Close>
                            <Button type="submit" disabled={saving}>
                                {saving ? "Saving…" : isEdit ? "Save Changes" : "Create Appointment"}
                            </Button>
                        </div>
                    </form>
                    <Dialog.Close asChild>
                        <button className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </Dialog.Close>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    )
}

/* ─── Appointment Card ───────────────────────────────────────────────────── */
const ApptCard = ({ appt, serviceOptions, onUpdated, onDelete }) => (
    <div className="bg-zinc-900/60 border border-white/10 rounded-2xl px-6 py-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-yellow-500/10 flex items-center justify-center shrink-0">
                <Scissors className="w-4 h-4 text-yellow-500" />
            </div>
            <div className="min-w-0">
                <p className="text-white font-semibold leading-tight">{appt.clientName}</p>
                <p className="text-gray-500 text-xs">{appt.phone}</p>
            </div>
        </div>

        <div className="hidden md:flex items-center gap-6 text-sm text-gray-400 shrink-0">
            <span className="text-gray-300">{appt.service}</span>
            {appt.appointmentTime && (
                <span className="flex items-center gap-1.5 text-gray-500">
                    <Clock className="w-3.5 h-3.5" />
                    {fmtTime(appt.appointmentTime)}
                </span>
            )}
            <span className={`flex items-center gap-1 font-medium ${appt.amount != null ? "text-yellow-400" : "text-gray-600 italic"}`}>
                {appt.amount != null
                    ? <><IndianRupee className="w-3.5 h-3.5" />{Number(appt.amount).toLocaleString("en-IN")}</>
                    : "—"}
            </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
            <AppointmentDialog
                appointment={appt}
                serviceOptions={serviceOptions}
                onSaved={(u) => onUpdated(u)}
                trigger={
                    <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 text-gray-400 hover:text-white hover:border-white/30 text-xs font-medium transition-colors">
                        <Pencil className="w-3.5 h-3.5" /> Edit
                    </button>
                }
            />
            <button onClick={() => onDelete(appt.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-500/20 text-red-400/70 hover:text-red-400 hover:border-red-500/40 text-xs font-medium transition-colors">
                <Trash2 className="w-3.5 h-3.5" /> Delete
            </button>
        </div>
    </div>
)

/* ─── Page ───────────────────────────────────────────────────────────────── */
const AppointmentPage = () => {
    const { services } = useSiteContent()
    const [all, setAll] = useState([])
    const [filter, setFilter] = useState("month")

    const serviceOptions = [...(services || []).map((s) => s.title), ...EXTRA_SERVICES]

    useEffect(() => { api.listAppointments().then(setAll) }, [])

    const handleSaved = (saved, isEdit) => {
        setAll((prev) => isEdit ? prev.map((a) => (a.id === saved.id ? saved : a)) : [saved, ...prev])
    }

    const handleDelete = async (id) => {
        if (!confirm("Delete this appointment?")) return
        await api.deleteAppointment(id)
        setAll((prev) => prev.filter((a) => a.id !== id))
    }

    // Filter by appointmentDate, sort newest-date first, then earliest-time-first within a day
    const filtered = useMemo(() => {
        const cutoff = filterCutoff(filter)
        return all
            .filter((a) => a.appointmentDate && new Date(a.appointmentDate + "T00:00:00") >= cutoff)
            .sort((a, b) => {
                const dateDiff = new Date(b.appointmentDate) - new Date(a.appointmentDate)
                if (dateDiff !== 0) return dateDiff
                return (a.appointmentTime || "").localeCompare(b.appointmentTime || "")
            })
    }, [all, filter])

    // Group by appointmentDate
    const groups = useMemo(() => {
        const map = new Map()
        for (const a of filtered) {
            const k = a.appointmentDate
            if (!map.has(k)) map.set(k, { label: dayLabel(k), date: k, items: [] })
            map.get(k).items.push(a)
        }
        return [...map.values()]
    }, [filtered])

    return (
        <>
            <PageHeader
                title="Appointments"
                description="Manage and track all client appointments."
                actions={
                    <div className="flex items-center gap-3">
                        <LiveClock />

                        {/* Filter toggle */}
                        <div className="flex items-center bg-zinc-900 border border-white/10 rounded-xl p-1 gap-0.5">
                            {FILTERS.map((f) => (
                                <button key={f.key} onClick={() => setFilter(f.key)}
                                    className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                                        filter === f.key ? "bg-yellow-500 text-black" : "text-gray-400 hover:text-white"
                                    }`}>
                                    {f.label}
                                </button>
                            ))}
                        </div>

                        <AppointmentDialog
                            serviceOptions={serviceOptions}
                            onSaved={(saved) => handleSaved(saved, false)}
                            trigger={
                                <Button>
                                    <span className="inline-flex items-center gap-2">
                                        <Plus className="w-4 h-4" /> New Appointment
                                    </span>
                                </Button>
                            }
                        />
                    </div>
                }
            />

            {groups.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-yellow-500/10 flex items-center justify-center mb-5">
                        <CalendarDays className="w-8 h-8 text-yellow-500" />
                    </div>
                    <h2 className="text-white font-semibold text-lg mb-2">No appointments</h2>
                    <p className="text-gray-500 text-sm max-w-xs">
                        No appointments for this period. Try a wider range or add a new one.
                    </p>
                </div>
            ) : (
                <div className="space-y-8">
                    {groups.map((group) => (
                        <div key={group.date}>
                            <div className="flex items-center gap-3 mb-3">
                                <CalendarDays className="w-4 h-4 text-yellow-500 shrink-0" />
                                <span className="text-sm font-semibold text-white">{group.label}</span>
                                <span className="text-xs text-gray-600">
                                    {group.items.length} {group.items.length === 1 ? "appointment" : "appointments"}
                                </span>
                                <div className="flex-1 h-px bg-white/5" />
                            </div>
                            <div className="space-y-2">
                                {group.items.map((a) => (
                                    <ApptCard key={a.id} appt={a} serviceOptions={serviceOptions}
                                        onUpdated={(u) => handleSaved(u, true)}
                                        onDelete={handleDelete} />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </>
    )
}

const inputCls = "w-full bg-zinc-800 border border-white/10 focus:border-yellow-500/50 rounded-lg px-3 py-2.5 outline-none text-white text-sm transition-colors"

const Field = ({ label, required, children }) => (
    <div>
        <label className="block text-xs uppercase tracking-[2px] text-gray-500 mb-1.5 font-medium">
            {label}{required && <span className="text-yellow-500 ml-1">*</span>}
        </label>
        {children}
    </div>
)

export default AppointmentPage
