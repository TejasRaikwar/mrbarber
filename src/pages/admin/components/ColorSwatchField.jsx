import { Check } from "lucide-react"

const PRESET_COLORS = [
    { name: "Gold", hex: "#eab308" },
    { name: "Amber", hex: "#f97316" },
    { name: "Emerald", hex: "#10b981" },
    { name: "Sky", hex: "#0ea5e9" },
    { name: "Rose", hex: "#f43f5e" },
    { name: "Violet", hex: "#8b5cf6" },
]

const ColorSwatchField = ({ label, value, onChange }) => (
    <div>
        {label && (
            <label className="block text-xs uppercase tracking-[2px] text-gray-500 mb-2">
                {label}
            </label>
        )}
        <div className="flex items-center gap-3">
            {PRESET_COLORS.map(({ name, hex }) => {
                const selected = value?.toLowerCase() === hex.toLowerCase()
                return (
                    <button
                        key={hex}
                        type="button"
                        title={name}
                        onClick={() => onChange(hex)}
                        style={{ backgroundColor: hex }}
                        className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ring-offset-2 ring-offset-black ${selected ? "ring-2 ring-white" : "hover:scale-110"
                            }`}
                    >
                        {selected && <Check className="w-4 h-4 text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.6)]" strokeWidth={3} />}
                    </button>
                )
            })}
        </div>
    </div>
)

export default ColorSwatchField
