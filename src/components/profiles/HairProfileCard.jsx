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
            <div className="relative bg-zinc-900/60 backdrop-blur-md border border-white/10 hover:border-yellow-500/30 transition-all duration-500 rounded-3xl overflow-hidden shadow-2xl">
                {/* Before Image (Primary, top layer with diagonal cut) */}
                <div
                    className="relative h-[420px] md:h-[480px] w-full"
                    style={{
                        clipPath: "polygon(0 0, 100% 0, 100% 60%, 60% 100%, 0 100%)",
                        WebkitClipPath: "polygon(0 0, 100% 0, 100% 60%, 60% 100%, 0 100%)"
                    }}
                >
                    <img
                        src={item.before}
                        alt={`${item.title} - before`}
                        className="h-full w-full object-cover select-none transition-transform duration-700 group-hover:scale-105"
                        draggable={false}
                    />

                    {/* Dim overlay for readability */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/40 pointer-events-none" />

                    {/* Before label */}
                    <div className="absolute left-4 top-4 z-20 bg-black/70 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider text-white">
                        Before
                    </div>
                </div>

                {/* After Image (smaller, bottom-right inset) */}
                <div className="absolute bottom-5 right-5 w-[45%] h-[42%] rounded-2xl overflow-hidden border-2 border-yellow-500/40 shadow-2xl z-20 transition-all duration-500 group-hover:scale-105 group-hover:border-yellow-500">
                    <img
                        src={item.after}
                        alt={`${item.title} - after`}
                        className="h-full w-full object-cover select-none"
                        draggable={false}
                    />
                    {/* After label */}
                    <div className="absolute left-2 top-2 bg-yellow-500 text-black px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                        After
                    </div>
                </div>

                {/* Diagonal divider stroke */}
                <div
                    className="absolute inset-0 pointer-events-none z-[15]"
                    style={{
                        background:
                            "linear-gradient(135deg, transparent 0%, transparent 59.6%, rgba(234,179,8,0.6) 59.6%, rgba(234,179,8,0.6) 60.4%, transparent 60.4%)"
                    }}
                />
            </div>

            {/* Caption */}
            <div className="mt-5 px-2 text-center">
                <h3 className="text-xl md:text-2xl font-bold text-white tracking-wide group-hover:text-yellow-500 transition-colors duration-300">
                    {item.title}
                </h3>
                <p className="text-gray-400 text-sm mt-2 font-light">
                    {item.description}
                </p>
            </div>
        </motion.div>
    )
}

export default HairProfileCard
