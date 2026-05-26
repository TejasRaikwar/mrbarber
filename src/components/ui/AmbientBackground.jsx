const AmbientBackground = () => {
    return (
        <div className="fixed inset-0 -z-10 overflow-hidden bg-black pointer-events-none">
            {/* Diagonal hatching — fine premium texture */}
            <div
                className="absolute inset-0 opacity-[0.04]"
                style={{
                    backgroundImage: `repeating-linear-gradient(
                        45deg,
                        rgba(255,255,255,0.6) 0px,
                        rgba(255,255,255,0.6) 1px,
                        transparent 1px,
                        transparent 10px
                    )`
                }}
            />

            {/* Crosshatch — second diagonal for woven texture */}
            <div
                className="absolute inset-0 opacity-[0.025]"
                style={{
                    backgroundImage: `repeating-linear-gradient(
                        -45deg,
                        rgba(255,255,255,0.6) 0px,
                        rgba(255,255,255,0.6) 1px,
                        transparent 1px,
                        transparent 10px
                    )`
                }}
            />

            {/* SVG film grain — adds organic noise */}
            <svg
                className="absolute inset-0 w-full h-full opacity-[0.07]"
                aria-hidden="true"
            >
                <filter id="ambient-noise">
                    <feTurbulence
                        type="fractalNoise"
                        baseFrequency="0.9"
                        numOctaves="3"
                        stitchTiles="stitch"
                    />
                    <feColorMatrix values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0" />
                </filter>
                <rect width="100%" height="100%" filter="url(#ambient-noise)" />
            </svg>

            {/* Warm yellow color wash from upper-left for depth */}
            <div
                className="absolute inset-0"
                style={{
                    background:
                        "radial-gradient(ellipse at 20% 0%, rgba(234,179,8,0.08), transparent 50%)"
                }}
            />

            {/* Cool counter-wash from lower-right */}
            <div
                className="absolute inset-0"
                style={{
                    background:
                        "radial-gradient(ellipse at 80% 100%, rgba(234,179,8,0.06), transparent 55%)"
                }}
            />

            {/* Vignette — darken edges for cinematic depth */}
            <div
                className="absolute inset-0"
                style={{
                    background:
                        "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.5) 100%)"
                }}
            />
        </div>
    )
}

export default AmbientBackground
