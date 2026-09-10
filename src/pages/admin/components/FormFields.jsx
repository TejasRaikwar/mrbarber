export const TextField = ({ label, value, onChange, type = "text", required, placeholder }) => (
    <div>
        <label className="block text-xs uppercase tracking-[2px] text-muted-foreground mb-2">{label}</label>
        <input
            type={type}
            value={value ?? ""}
            onChange={(e) => onChange(e.target.value)}
            required={required}
            placeholder={placeholder}
            className="w-full bg-background border border-border focus:border-(--brand)/50 rounded-lg px-3 py-2.5 outline-none text-foreground"
        />
    </div>
)

export const NumberField = ({ label, value, onChange, min, max, step }) => (
    <div>
        <label className="block text-xs uppercase tracking-[2px] text-muted-foreground mb-2">{label}</label>
        <input
            type="number"
            value={value ?? 0}
            onChange={(e) => onChange(Number(e.target.value))}
            min={min}
            max={max}
            step={step}
            className="w-full bg-background border border-border focus:border-(--brand)/50 rounded-lg px-3 py-2.5 outline-none text-foreground"
        />
    </div>
)

export const TextArea = ({ label, value, onChange, rows = 4, placeholder }) => (
    <div>
        <label className="block text-xs uppercase tracking-[2px] text-muted-foreground mb-2">{label}</label>
        <textarea
            value={value ?? ""}
            onChange={(e) => onChange(e.target.value)}
            rows={rows}
            placeholder={placeholder}
            className="w-full bg-background border border-border focus:border-(--brand)/50 rounded-lg px-3 py-2.5 outline-none text-foreground resize-y"
        />
    </div>
)

export const Button = ({ children, variant = "primary", type = "button", disabled, onClick }) => {
    const styles = {
        primary: "bg-(--brand) hover:bg-(--brand-hover) text-(--brand-foreground)",
        ghost: "border border-border hover:border-foreground/25 text-foreground",
        danger: "border border-red-500/40 hover:bg-red-500/10 text-red-600"
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
            <h1 className="text-3xl font-bold text-foreground mb-1">{title}</h1>
            {description && <p className="text-muted-foreground text-sm">{description}</p>}
        </div>
        <div className="flex items-center gap-3">{actions}</div>
    </div>
)
