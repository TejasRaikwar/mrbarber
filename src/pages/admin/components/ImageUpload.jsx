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
                <label className="block text-xs uppercase tracking-[2px] text-gray-500 mb-2">
                    {label}
                </label>
            )}
            <div className="flex items-center gap-3">
                <div className="w-20 h-20 rounded-lg border border-white/10 bg-black/40 flex items-center justify-center overflow-hidden shrink-0">
                    {value ? (
                        <img src={value} alt="" className="w-full h-full object-cover" />
                    ) : (
                        <ImageIcon className="w-6 h-6 text-gray-600" />
                    )}
                </div>
                <div className="flex-1 min-w-0">
                    <label className="inline-flex items-center gap-2 cursor-pointer bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-2 rounded-lg text-sm">
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
                            className="ml-2 text-xs text-gray-500 hover:text-red-400 transition-colors"
                        >
                            Remove
                        </button>
                    )}
                    {value && (
                        <p className="text-xs text-gray-500 mt-1 truncate">{value}</p>
                    )}
                    {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
                </div>
            </div>
        </div>
    )
}

export default ImageUpload
