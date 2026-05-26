import { motion } from "framer-motion"

const SectionHeading = ({ eyebrow, title, description, className = "" }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true, margin: "-80px" }}
            className={`text-center mb-10 ${className}`}
        >
            <p className="text-yellow-500 uppercase tracking-[5px] mb-3 text-sm">
                {eyebrow}
            </p>

            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
                {title}
            </h2>

            {typeof description === "string" ? (
                <p className="text-gray-400 max-w-2xl mx-auto">{description}</p>
            ) : (
                description
            )}
        </motion.div>
    )
}

export default SectionHeading
