import { useEffect, useState, useMemo } from "react"
import { Trash2, Mail, Phone, MapPin, User, CalendarDays } from "lucide-react"
import { api } from "@/api/client"
import { PageHeader, Button } from "./components/FormFields"

const FILTERS = [
    { key: "today",  label: "Today" },
    { key: "week",   label: "This Week" },
    { key: "month",  label: "This Month" },
]

const startOf = (key) => {
    const now = new Date()
    if (key === "today") {
        return new Date(now.getFullYear(), now.getMonth(), now.getDate())
    }
    if (key === "week") {
        const d = new Date(now)
        d.setDate(d.getDate() - 6)
        d.setHours(0, 0, 0, 0)
        return d
    }
    // month — default
    const d = new Date(now)
    d.setDate(d.getDate() - 29)
    d.setHours(0, 0, 0, 0)
    return d
}

const dayLabel = (dateStr) => {
    const d = new Date(dateStr)
    const today = new Date(); today.setHours(0,0,0,0)
    const yesterday = new Date(today); yesterday.setDate(today.getDate() - 1)
    const target = new Date(d); target.setHours(0,0,0,0)
    if (target.getTime() === today.getTime()) return "Today"
    if (target.getTime() === yesterday.getTime()) return "Yesterday"
    return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
}

const fmtTime = (iso) => {
    if (!iso) return ""
    return new Date(iso).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })
}

const dateKey = (iso) => new Date(iso).toDateString()

const EnquiriesPage = () => {
    const [all, setAll] = useState([])
    const [filter, setFilter] = useState("month")

    useEffect(() => {
        api.listEnquiries().then(setAll)
    }, [])

    const handleDelete = async (id) => {
        if (!confirm("Delete this enquiry?")) return
        await api.deleteEnquiry(id)
        setAll((prev) => prev.filter((e) => e.id !== id))
    }

    const filtered = useMemo(() => {
        const cutoff = startOf(filter)
        return all
            .filter((e) => e.submittedAt && new Date(e.submittedAt) >= cutoff)
            .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt))
    }, [all, filter])

    // Group by calendar day
    const groups = useMemo(() => {
        const map = new Map()
        for (const e of filtered) {
            const k = dateKey(e.submittedAt)
            if (!map.has(k)) map.set(k, { label: dayLabel(e.submittedAt), items: [] })
            map.get(k).items.push(e)
        }
        return [...map.values()]
    }, [filtered])

    return (
        <>
            <PageHeader
                title="Enquiries"
                description="Customer enquiries submitted via the website."
                actions={
                    <div className="flex items-center bg-zinc-900 border border-white/10 rounded-xl p-1 gap-0.5">
                        {FILTERS.map((f) => (
                            <button
                                key={f.key}
                                onClick={() => setFilter(f.key)}
                                className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                                    filter === f.key
                                        ? "bg-yellow-500 text-black"
                                        : "text-gray-400 hover:text-white"
                                }`}
                            >
                                {f.label}
                            </button>
                        ))}
                    </div>
                }
            />

            {groups.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-yellow-500/10 flex items-center justify-center mb-5">
                        <Mail className="w-8 h-8 text-yellow-500" />
                    </div>
                    <h2 className="text-white font-semibold text-lg mb-2">No enquiries</h2>
                    <p className="text-gray-500 text-sm max-w-xs">
                        No enquiries received for this period. Try a wider date range.
                    </p>
                </div>
            ) : (
                <div className="space-y-8">
                    {groups.map((group) => (
                        <div key={group.label}>
                            {/* Day header */}
                            <div className="flex items-center gap-3 mb-3">
                                <CalendarDays className="w-4 h-4 text-yellow-500 shrink-0" />
                                <span className="text-sm font-semibold text-white">{group.label}</span>
                                <span className="text-xs text-gray-600">
                                    {group.items.length} {group.items.length === 1 ? "enquiry" : "enquiries"}
                                </span>
                                <div className="flex-1 h-px bg-white/5" />
                            </div>

                            {/* Enquiry cards */}
                            <div className="space-y-3">
                                {group.items.map((e) => (
                                    <div key={e.id}
                                        className="bg-zinc-900/60 border border-white/10 rounded-2xl px-6 py-4">
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex items-center gap-3 min-w-0">
                                                <div className="w-9 h-9 rounded-xl bg-yellow-500/10 flex items-center justify-center shrink-0">
                                                    <User className="w-4 h-4 text-yellow-500" />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-white font-semibold leading-tight">{e.name}</p>
                                                    <p className="text-gray-600 text-xs">{fmtTime(e.submittedAt)}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-4 shrink-0">
                                                <div className="hidden sm:flex items-center gap-4 text-sm text-gray-400">
                                                    {e.phone && (
                                                        <span className="flex items-center gap-1.5">
                                                            <Phone className="w-3.5 h-3.5 text-gray-600" />
                                                            {e.phone}
                                                        </span>
                                                    )}
                                                    {e.email && (
                                                        <span className="flex items-center gap-1.5">
                                                            <Mail className="w-3.5 h-3.5 text-gray-600" />
                                                            {e.email}
                                                        </span>
                                                    )}
                                                    {e.address && (
                                                        <span className="flex items-center gap-1.5">
                                                            <MapPin className="w-3.5 h-3.5 text-gray-600" />
                                                            {e.address}
                                                        </span>
                                                    )}
                                                </div>
                                                <button
                                                    onClick={() => handleDelete(e.id)}
                                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-500/20 text-red-400/70 hover:text-red-400 hover:border-red-500/40 text-xs font-medium transition-colors shrink-0"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                    Delete
                                                </button>
                                            </div>
                                        </div>

                                        {/* Mobile: contact details below */}
                                        {(e.phone || e.email || e.address) && (
                                            <div className="sm:hidden flex flex-wrap gap-x-4 gap-y-1 mt-3 text-xs text-gray-400">
                                                {e.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{e.phone}</span>}
                                                {e.email && <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{e.email}</span>}
                                                {e.address && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{e.address}</span>}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </>
    )
}

export default EnquiriesPage
