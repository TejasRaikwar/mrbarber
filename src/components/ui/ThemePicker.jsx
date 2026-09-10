import { Check } from "lucide-react"
import { THEMES } from "@/lib/themes"

const Swatch = ({ colors }) => (
    <span className="flex items-center -space-x-1.5 shrink-0">
        {colors.map((color, i) => (
            <span
                key={i}
                style={{ background: color }}
                className="w-4 h-4 rounded-full border border-border shadow-sm"
            />
        ))}
    </span>
)

/**
 * Theme selector — a grid of palette cards. Fully controlled: it only stages
 * a choice via `value`/`onChange`, it never applies or persists a theme
 * itself. Site Settings is the only place a theme gets saved (to the
 * database), which is what keeps every visitor and device in sync.
 */
const ThemePicker = ({ value, onChange, className = "" }) => (
    <div className={`grid grid-cols-1 sm:grid-cols-2 gap-2.5 ${className}`}>
        {THEMES.map((t) => {
            const selected = t.id === value
            return (
                <button
                    key={t.id}
                    type="button"
                    onClick={() => onChange(t.id)}
                    aria-pressed={selected}
                    title={t.description}
                    className={`flex items-center gap-2.5 rounded-xl border px-3 py-2.5 text-left transition-all cursor-pointer ${
                        selected
                            ? "border-(--brand) bg-(--brand)/8 shadow-sm"
                            : "border-border bg-card hover:border-(--brand)/40 hover:bg-muted"
                    }`}
                >
                    <Swatch colors={t.swatch} />
                    <span className="flex-1 min-w-0 text-sm font-medium truncate">{t.name}</span>
                    {selected && <Check className="w-4 h-4 text-(--brand) shrink-0" strokeWidth={3} />}
                </button>
            )
        })}
    </div>
)

export default ThemePicker
