import { motion } from "framer-motion"
import { Star, Quote } from "lucide-react"

const ReviewCard = ({ item, index }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true, margin: "-50px" }}
            className="group relative bg-zinc-900/60 backdrop-blur-md border border-white/10 hover:border-yellow-500/30 rounded-3xl p-7 md:p-8 shadow-2xl transition-all duration-500 hover:-translate-y-1 flex flex-col h-full"
        >
            <Quote
                className="absolute top-6 right-6 w-10 h-10 text-yellow-500/10 group-hover:text-yellow-500/20 transition-colors duration-500"
                strokeWidth={1.5}
            />

            <div className="flex items-center gap-1 mb-5">
                {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                        key={i}
                        className={`w-4 h-4 ${
                            i < item.rating
                                ? "fill-yellow-500 text-yellow-500"
                                : "fill-zinc-700 text-zinc-700"
                        }`}
                    />
                ))}
            </div>

            <p className="text-gray-300 text-base leading-relaxed font-light flex-1">
                &ldquo;{item.quote}&rdquo;
            </p>

            <div className="flex items-center gap-4 mt-7 pt-6 border-t border-white/5">
                {item.avatarUrl ? (
                    <img
                        src={item.avatarUrl}
                        alt={item.name}
                        className="w-11 h-11 rounded-full object-cover shrink-0 shadow-lg"
                    />
                ) : (
                    <div className="w-11 h-11 rounded-full bg-linear-to-br from-yellow-500 to-yellow-600 text-black font-bold flex items-center justify-center shrink-0 shadow-lg">
                        {item.initials}
                    </div>
                )}
                <div className="min-w-0">
                    <h4 className="text-white font-semibold tracking-wide truncate">
                        {item.name}
                    </h4>
                    {item.location && (
                        <p className="text-gray-500 text-xs uppercase tracking-[2px] mt-0.5">
                            {item.location}
                        </p>
                    )}
                </div>
            </div>
        </motion.div>
    )
}

export default ReviewCard
