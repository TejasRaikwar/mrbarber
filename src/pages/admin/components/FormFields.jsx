export const TextField = ({ label, value, onChange, type = "text", required, placeholder }) => (
    <div>
        <label className="block text-xs uppercase tracking-[2px] text-gray-500 mb-2">{label}</label>
        <input
            type={type}
            value={value ?? ""}
            onChange={(e) => onChange(e.target.value)}
            required={required}
            placeholder={placeholder}
            className="w-full bg-black/40 border border-white/10 focus:border-yellow-500/50 rounded-lg px-3 py-2.5 outline-none text-white"
        />
    </div>
)

export const NumberField = ({ label, value, onChange, min, max, step }) => (
    <div>
        <label className="block text-xs uppercase tracking-[2px] text-gray-500 mb-2">{label}</label>
        <input
            type="number"
            value={value ?? 0}
            onChange={(e) => onChange(Number(e.target.value))}
            min={min}
            max={max}
            step={step}
            className="w-full bg-black/40 border border-white/10 focus:border-yellow-500/50 rounded-lg px-3 py-2.5 outline-none text-white"
        />
    </div>
)

export const TextArea = ({ label, value, onChange, rows = 4, placeholder }) => (
    <div>
        <label className="block text-xs uppercase tracking-[2px] text-gray-500 mb-2">{label}</label>
        <textarea
            value={value ?? ""}
            onChange={(e) => onChange(e.target.value)}
            rows={rows}
            placeholder={placeholder}
            className="w-full bg-black/40 border border-white/10 focus:border-yellow-500/50 rounded-lg px-3 py-2.5 outline-none text-white resize-y"
        />
    </div>
)

export const Button = ({ children, variant = "primary", type = "button", disabled, onClick }) => {
    const styles = {
        primary: "bg-yellow-500 hover:bg-yellow-600 text-black",
        ghost: "border border-white/10 hover:border-white/30 text-white",
        danger: "border border-red-500/40 hover:bg-red-500/10 text-red-400"
    }
    return (
        <button
            type={type}
            disabled={disabled}
            onClick={onClick}
            className={`${styles[variant]} disabled:opacity-50 px-4 py-2 rounded-lg font-semibold text-sm transition-all`}
        >
            {children}
        </button>
    )
}

export const PageHeader = ({ title, description, actions }) => (
    <div className="flex items-start justify-between mb-8 gap-6">
        <div>
            <h1 className="text-3xl font-bold text-white mb-1">{title}</h1>
            {description && <p className="text-gray-400 text-sm">{description}</p>}
        </div>
        <div className="flex items-center gap-3">{actions}</div>
    </div>
)
