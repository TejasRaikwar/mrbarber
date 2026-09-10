import { Dialog } from "radix-ui"
import { AlertTriangle, X } from "lucide-react"
import { Button } from "./FormFields"

export const ConfirmDialog = ({
    open,
    onOpenChange,
    title = "Are you sure?",
    description = "This action cannot be undone.",
    confirmLabel = "Delete",
    cancelLabel = "Cancel",
    variant = "danger",
    onConfirm,
    loading = false
}) => {
    const handleConfirm = async () => {
        if (onConfirm) {
            await onConfirm()
        }
    }

    return (
        <Dialog.Root open={open} onOpenChange={onOpenChange}>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0" />
                <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 bg-zinc-900 border border-white/10 rounded-2xl p-6 shadow-2xl data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95">
                    <div className="flex items-start gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                            variant === "danger"
                                ? "bg-red-500/10 text-red-400 border border-red-500/20"
                                : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                        }`}>
                            <AlertTriangle className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0 pt-0.5">
                            <Dialog.Title className="text-white font-bold text-lg leading-snug">
                                {title}
                            </Dialog.Title>
                            <Dialog.Description className="text-gray-400 text-sm mt-1.5 leading-relaxed">
                                {description}
                            </Dialog.Description>
                        </div>
                    </div>

                    <div className="flex justify-end items-center gap-3 mt-6 pt-4 border-t border-white/5">
                        <Dialog.Close asChild>
                            <Button variant="ghost" disabled={loading}>
                                {cancelLabel}
                            </Button>
                        </Dialog.Close>
                        <button
                            type="button"
                            disabled={loading}
                            onClick={handleConfirm}
                            className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all disabled:opacity-50 flex items-center gap-2 ${
                                variant === "danger"
                                    ? "bg-red-600 hover:bg-red-700 text-white"
                                    : "bg-(--brand) hover:bg-(--brand-hover) text-(--brand-foreground)"
                            }`}
                        >
                            {loading ? "Processing…" : confirmLabel}
                        </button>
                    </div>

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

export default ConfirmDialog
