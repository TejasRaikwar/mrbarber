const AmbientBackground = () => {
    return (
        <div className="fixed inset-0 -z-10 overflow-hidden bg-background pointer-events-none">
            {/* Diagonal hatching — fine linen texture in the theme accent */}
            <div
                className="absolute inset-0 opacity-[0.05]"
                style={{
                    backgroundImage: `repeating-linear-gradient(
                        45deg,
                        var(--brand) 0px,
                        var(--brand) 1px,
                        transparent 1px,
                        transparent 10px
                    )`
                }}
            />

            {/* Crosshatch — second diagonal for a woven feel */}
            <div
                className="absolute inset-0 opacity-[0.035]"
                style={{
                    backgroundImage: `repeating-linear-gradient(
                        -45deg,
                        var(--brand) 0px,
                        var(--brand) 1px,
                        transparent 1px,
                        transparent 10px
                    )`
                }}
            />

            {/* SVG grain — organic paper noise, tinted with the foreground */}
            <svg
                className="absolute inset-0 w-full h-full opacity-[0.035]"
                aria-hidden="true"
            >
                <filter id="ambient-noise">
                    <feTurbulence
                        type="fractalNoise"
                        baseFrequency="0.9"
                        numOctaves="3"
                        stitchTiles="stitch"
                    />
                    <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0" />
                </filter>
                <rect width="100%" height="100%" filter="url(#ambient-noise)" />
            </svg>

            {/* Warm beige wash from the upper-left for depth */}
            <div
                className="absolute inset-0"
                style={{
                    background:
                        "radial-gradient(ellipse at 20% 0%, color-mix(in srgb, var(--accent) 70%, transparent), transparent 55%)"
                }}
            />

            {/* Accent counter-wash from the lower-right */}
            <div
                className="absolute inset-0"
                style={{
                    background:
                        "radial-gradient(ellipse at 80% 100%, color-mix(in srgb, var(--brand) 10%, transparent), transparent 55%)"
                }}
            />

            {/* Soft edge shading — keeps the canvas from reading as flat paper */}
            <div
                className="absolute inset-0"
                style={{
                    background:
                        "radial-gradient(ellipse at center, transparent 45%, color-mix(in srgb, var(--foreground) 7%, transparent) 100%)"
                }}
            />
        </div>
    )
}

export default AmbientBackground
