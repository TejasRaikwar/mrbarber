import { useState } from "react"
import { Upload, Image as ImageIcon } from "lucide-react"
import { api } from "@/api/client"

const ImageUpload = ({ value, onChange, label }) => {
    const [uploading, setUploading] = useState(false)
    const [error, setError] = useState(null)

    const onFile = async (e) => {
        const file = e.target.files?.[0]
        if (!file) return
        setError(null)
        setUploading(true)
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

    return (
        <div>
            {label && (
                <label className="block text-xs uppercase tracking-[2px] text-muted-foreground mb-2">
                    {label}
                </label>
            )}
            <div className="flex items-center gap-3">
                <div className="w-20 h-20 rounded-lg border border-border bg-background flex items-center justify-center overflow-hidden shrink-0">
                    {value ? (
                        <img src={value} alt="" className="w-full h-full object-cover" />
                    ) : (
                        <ImageIcon className="w-6 h-6 text-muted-foreground/70" />
                    )}
                </div>
                <div className="flex-1 min-w-0">
                    <label className="inline-flex items-center gap-2 cursor-pointer bg-muted hover:bg-accent border border-border px-3 py-2 rounded-lg text-sm">
                        <Upload className="w-4 h-4" />
                        {uploading ? "Uploading…" : value ? "Replace" : "Upload"}
                        <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={onFile}
                            disabled={uploading}
                        />
                    </label>
                    {value && (
                        <button
                            type="button"
                            onClick={() => onChange("")}
                            className="ml-2 text-xs text-muted-foreground hover:text-red-600 transition-colors"
                        >
                            Remove
                        </button>
                    )}
                    {value && (
                        <p className="text-xs text-muted-foreground mt-1 truncate">{value}</p>
                    )}
                    {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
                </div>
            </div>
        </div>
    )
}

export default ImageUpload
