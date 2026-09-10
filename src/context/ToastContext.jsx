import { createContext, useCallback, useContext, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { CheckCircle2, XCircle, Info, X } from "lucide-react"

const ToastContext = createContext(null)

const STYLES = {
    success: { icon: CheckCircle2, border: "border-emerald-500/30", iconColor: "text-emerald-400" },
    error: { icon: XCircle, border: "border-red-500/30", iconColor: "text-red-400" },
    info: { icon: Info, border: "border-(--brand)/30", iconColor: "text-(--brand)" }
}

let idSeq = 0

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([])
    const timers = useRef(new Map())

    const dismiss = useCallback((id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id))
        const timer = timers.current.get(id)
        if (timer) {
            clearTimeout(timer)
            timers.current.delete(id)
        }
    }, [])

    const show = useCallback((message, type = "info", duration = 4000) => {
        const id = ++idSeq
        setToasts((prev) => [...prev, { id, message, type }])
        timers.current.set(id, setTimeout(() => dismiss(id), duration))
    }, [dismiss])

    const toast = {
        success: (message) => show(message, "success"),
        error: (message) => show(message, "error", 6000),
        info: (message) => show(message, "info")
    }

    return (
        <ToastContext.Provider value={toast}>
            {children}
            <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-2.5 w-[min(360px,calc(100vw-2.5rem))] pointer-events-none">
                <AnimatePresence>
                    {toasts.map((t) => {
                        const { icon: Icon, border, iconColor } = STYLES[t.type] || STYLES.info
                        return (
                            <motion.div
                                key={t.id}
                                layout
                                initial={{ opacity: 0, y: 12, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, x: 40, transition: { duration: 0.2 } }}
                                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                                className={`pointer-events-auto flex items-start gap-3 bg-zinc-900/95 backdrop-blur-md border ${border} rounded-xl px-4 py-3 shadow-2xl`}
                            >
                                <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${iconColor}`} />
                                <p className="text-sm text-white flex-1 leading-snug">{t.message}</p>
                                <button
                                    onClick={() => dismiss(t.id)}
                                    className="text-gray-500 hover:text-white transition-colors shrink-0"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </motion.div>
                        )
                    })}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    )
}

export const useToast = () => {
    const ctx = useContext(ToastContext)
    if (!ctx) throw new Error("useToast must be used within a ToastProvider")
    return ctx
}
