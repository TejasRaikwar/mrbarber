import { motion } from "framer-motion"

const ServiceCard = ({ item, index }) => {
    const { Icon } = item

    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true, margin: "-50px" }}
            className="group relative bg-zinc-900/60 backdrop-blur-md border border-white/10 hover:border-yellow-500/30 rounded-3xl p-7 shadow-2xl transition-all duration-500 hover:-translate-y-1 overflow-hidden h-full flex flex-col"
        >
            {/* Hover glow */}
            <div className="absolute -top-20 -right-20 w-48 h-48 bg-yellow-500/0 group-hover:bg-yellow-500/10 blur-3xl rounded-full transition-all duration-700 pointer-events-none" />

            {/* Icon */}
            <div className="relative w-14 h-14 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center mb-6 group-hover:bg-yellow-500 group-hover:border-yellow-500 transition-all duration-500">
                <Icon
                    className="w-6 h-6 text-yellow-500 group-hover:text-black transition-colors duration-500"
                    strokeWidth={1.75}
                />
            </div>

            {/* Title */}
            <h3 className="text-xl font-bold text-white tracking-wide mb-3 group-hover:text-yellow-500 transition-colors duration-300">
                {item.title}
            </h3>

            {/* Description */}
            <p className="text-gray-400 text-sm leading-relaxed font-light">
                {item.description}
            </p>
        </motion.div>
    )
}

export default ServiceCard
