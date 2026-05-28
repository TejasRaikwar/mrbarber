import { useState } from "react"
import { Dialog } from "radix-ui"
import { X, CheckCircle2 } from "lucide-react"
import { api } from "@/api/client"

const Field = ({ label, type = "text", value, onChange, placeholder, required }) => (
    <div>
        <label className="block text-xs uppercase tracking-[2px] text-gray-400 mb-1.5">{label}</label>
        <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            required={required}
            className="w-full bg-white/5 border border-white/10 focus:border-yellow-500/60 rounded-lg px-3 py-2.5 outline-none text-white placeholder-gray-600 text-sm"
        />
    </div>
)

const EMPTY = { name: "", email: "", phone: "", address: "" }

const EnquiryDialog = ({ trigger }) => {
    const [open, setOpen] = useState(false)
    const [form, setForm] = useState(EMPTY)
    const [submitting, setSubmitting] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState(null)

    const set = (key) => (val) => setForm((f) => ({ ...f, [key]: val }))

    const handleOpen = (v) => {
        setOpen(v)
        if (!v) {
            setForm(EMPTY)
            setSuccess(false)
            setError(null)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSubmitting(true)
        setError(null)
        try {
            await api.submitEnquiry(form)
            setSuccess(true)
        } catch {
            setError("Something went wrong. Please try again.")
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <Dialog.Root open={open} onOpenChange={handleOpen}>
            <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0" />
                <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 bg-zinc-900 border border-white/10 rounded-2xl p-7 shadow-2xl data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95">
                    <Dialog.Title className="text-white font-bold text-xl mb-1">Enquire Now</Dialog.Title>
                    <Dialog.Description className="text-gray-400 text-sm mb-6">
                        Fill in your details and we'll get back to you shortly.
                    </Dialog.Description>

                    {success ? (
                        <div className="flex flex-col items-center py-8 gap-4 text-center">
                            <CheckCircle2 className="w-12 h-12 text-yellow-500" />
                            <p className="text-white font-semibold text-lg">Thank you!</p>
                            <p className="text-gray-400 text-sm">We've received your enquiry and will be in touch soon.</p>
                            <button
                                onClick={() => handleOpen(false)}
                                className="mt-2 px-6 py-2 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold rounded-lg text-sm transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <Field label="Name" value={form.name} onChange={set("name")} placeholder="Your full name" required />
                            <Field label="Email" type="email" value={form.email} onChange={set("email")} placeholder="your@email.com" required />
                            <Field label="Mobile Number" type="tel" value={form.phone} onChange={set("phone")} placeholder="+91 00000 00000" required />
                            <Field label="Address" value={form.address} onChange={set("address")} placeholder="Your address" />

                            {error && <p className="text-red-400 text-sm">{error}</p>}

                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full bg-yellow-500 hover:bg-yellow-600 disabled:opacity-50 text-black font-semibold py-2.5 rounded-lg text-sm transition-colors mt-2"
                            >
                                {submitting ? "Submitting…" : "Submit Enquiry"}
                            </button>
                        </form>
                    )}

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

export default EnquiryDialog
