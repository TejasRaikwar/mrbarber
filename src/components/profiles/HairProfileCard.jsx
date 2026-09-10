import { motion } from "framer-motion"

const HairProfileCard = ({ item, index }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ y: -6 }}
            transition={{ duration: 0.7, delay: index * 0.15, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true, margin: "-50px" }}
            className="group cursor-pointer"
        >
            {/* Visual Frame */}
            <div className="relative bg-card backdrop-blur-md border border-border hover:border-(--brand)/30 transition-all duration-500 rounded-3xl overflow-hidden shadow-lg">
                {/* Before Image (Primary, top layer with diagonal cut) */}
                <div
                    className="relative h-[420px] md:h-[480px] w-full"
                    style={{
                        clipPath: "polygon(0 0, 100% 0, 100% 60%, 60% 100%, 0 100%)",
                        WebkitClipPath: "polygon(0 0, 100% 0, 100% 60%, 60% 100%, 0 100%)"
                    }}
                >
                    {item.before ? (
                        <img
                            src={item.before}
                            alt=""
                            className="h-full w-full object-cover select-none transition-transform duration-700 group-hover:scale-105"
                            draggable={false}
                            onError={(e) => { e.currentTarget.style.display = "none" }}
                        />
                    ) : (
                        <div className="h-full w-full bg-muted flex items-center justify-center text-muted-foreground/70 text-sm font-light">No image uploaded</div>
                    )}

                    {/* Dim overlay for readability */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/40 pointer-events-none" />

                    {/* Before label */}
                    <div className="absolute left-4 top-4 z-20 bg-background/85 backdrop-blur-md border border-border px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider text-foreground">
                        Before
                    </div>
                </div>

                {/* After Image (smaller, bottom-right inset) */}
                <div className="absolute bottom-5 right-5 w-[45%] h-[42%] rounded-2xl overflow-hidden border-2 border-(--brand)/40 shadow-lg z-20 transition-all duration-500 group-hover:scale-105 group-hover:border-(--brand)">
                    {item.after ? (
                        <img
                            src={item.after}
                            alt=""
                            className="h-full w-full object-cover select-none"
                            draggable={false}
                            onError={(e) => { e.currentTarget.style.display = "none" }}
                        />
                    ) : (
                        <div className="h-full w-full bg-muted flex items-center justify-center text-muted-foreground/70 text-xs font-light">No image</div>
                    )}
                    {/* After label */}
                    <div className="absolute left-2 top-2 bg-(--brand) text-(--brand-foreground) px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                        After
                    </div>
                </div>

                {/* Diagonal divider stroke */}
                <div
                    className="absolute inset-0 pointer-events-none z-[15]"
                    style={{
                        background:
                            "linear-gradient(135deg, transparent 0%, transparent 59.6%, color-mix(in srgb, var(--brand) 60%, transparent) 59.6%, color-mix(in srgb, var(--brand) 60%, transparent) 60.4%, transparent 60.4%)"
                    }}
                />
            </div>

            {/* Caption */}
            <div className="mt-5 px-2 text-center">
                <h3 className="text-xl md:text-2xl font-bold text-foreground tracking-wide group-hover:text-(--brand) transition-colors duration-300">
                    {item.title}
                </h3>
                <p className="text-muted-foreground text-sm mt-2 font-light">
                    {item.description}
                </p>
            </div>
        </motion.div>
    )
}

export default HairProfileCard
