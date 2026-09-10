import { useState, useRef } from "react"
import { api } from "@/api/client"
import { useSiteContent } from "@/context/SiteContentContext"
import { useToast } from "@/context/ToastContext"
import { PageHeader, Button } from "./components/FormFields"
import ConfirmDialog from "./components/ConfirmDialog"
import { Trash2, Film, UploadCloud, AlertCircle } from "lucide-react"

const AdminReels = () => {
    const { reels, settings, refresh } = useSiteContent()
    const toast = useToast()
    const [uploading, setUploading] = useState(false)
    const [title, setTitle] = useState("")
    const [file, setFile] = useState(null)
    const [error, setError] = useState(null)
    const [deleteId, setDeleteId] = useState(null)
    const [deleting, setDeleting] = useState(false)
    const fileInputRef = useRef(null)

    const maxReels = settings?.maxReels || 10
    const currentCount = reels?.length || 0

    const handleUpload = async (e) => {
        e.preventDefault()
        if (!file || !title) return

        if (currentCount >= maxReels) {
            setError(`Maximum limit of ${maxReels} reels reached. Delete one first.`)
            return
        }

        setUploading(true)
        setError(null)
        try {
            await api.uploadReel(file, title)
            await refresh()
            setTitle("")
            setFile(null)
            if (fileInputRef.current) fileInputRef.current.value = ""
            toast.success("Reel uploaded")
        } catch (err) {
            setError(err.message || "Upload failed. Please try again.")
        } finally {
            setUploading(false)
        }
    }

    const handleConfirmDelete = async () => {
        if (!deleteId) return
        setDeleting(true)
        try {
            await api.deleteAdmin("reels", deleteId)
            await refresh()
            setDeleteId(null)
            toast.success("Reel deleted")
        } catch (err) {
            setError(err.message || "Failed to delete reel.")
            toast.error(err.message || "Failed to delete reel")
        } finally {
            setDeleting(false)
        }
    }

    return (
        <div className="space-y-8">
            <PageHeader
                title="Manage Reels"
                description={`Upload and manage your video reels. You have ${currentCount} of ${maxReels} reels allowed.`}
            />

            {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-600 px-4 py-3 rounded-lg flex items-center gap-3 text-sm">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    {error}
                </div>
            )}

            <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="text-sm font-semibold mb-4 text-foreground uppercase tracking-wider">Upload New Reel</h3>
                <form onSubmit={handleUpload} className="space-y-4">
                    <div>
                        <label className="block text-xs text-muted-foreground mb-1">Title / Caption</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-(--brand)"
                            placeholder="e.g., Fresh Fade Friday"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-xs text-muted-foreground mb-1">Video File (Max 100MB)</label>
                        <input
                            type="file"
                            accept="video/*"
                            onChange={(e) => setFile(e.target.files[0])}
                            ref={fileInputRef}
                            className="w-full bg-background border border-border rounded-lg px-4 py-2 text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-(--brand) file:text-(--brand-foreground) hover:file:bg-(--brand-hover) cursor-pointer"
                            required
                        />
                    </div>
                    <Button type="submit" disabled={uploading || currentCount >= maxReels}>
                        {uploading ? (
                            <span className="flex items-center gap-2"><UploadCloud className="w-4 h-4 animate-bounce" /> Uploading (Please wait)...</span>
                        ) : (
                            "Upload Reel"
                        )}
                    </Button>
                </form>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {reels?.map((reel) => (
                    <div key={reel.id} className="group relative rounded-xl overflow-hidden bg-background border border-border aspect-[9/16]">
                        <video
                            src={reel.videoUrl}
                            className="w-full h-full object-cover"
                            controls
                            playsInline
                            muted
                        />
                        <div className="absolute top-0 left-0 w-full p-4 bg-gradient-to-b from-black/80 to-transparent flex justify-between items-start opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="text-sm font-medium text-(--media-foreground) drop-shadow-md">{reel.title}</span>
                            <button
                                onClick={() => setDeleteId(reel.id)}
                                className="w-8 h-8 rounded-full bg-red-500/25 text-red-100 flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors backdrop-blur-md"
                                title="Delete Reel"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ))}
                {(!reels || reels.length === 0) && (
                    <div className="col-span-full py-12 flex flex-col items-center justify-center text-muted-foreground border border-dashed border-border rounded-xl">
                        <Film className="w-8 h-8 mb-3 opacity-20" />
                        <p className="text-sm">No reels uploaded yet.</p>
                    </div>
                )}
            </div>

            <ConfirmDialog
                open={!!deleteId}
                onOpenChange={(open) => !open && setDeleteId(null)}
                title="Delete Reel"
                description="Are you sure you want to delete this video reel? This action cannot be undone."
                confirmLabel="Delete"
                variant="danger"
                loading={deleting}
                onConfirm={handleConfirmDelete}
            />
        </div>
    )
}

export default AdminReels
