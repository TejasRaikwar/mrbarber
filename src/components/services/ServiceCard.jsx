import { useRef } from "react"
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion"

const ServiceCard = ({ item, index }) => {
    const { Icon } = item
    const ref = useRef(null)

    // Track mouse position relative to card center for 3D tilt
    const mouseX = useMotionValue(0)
    const mouseY = useMotionValue(0)

    const springConfig = { stiffness: 200, damping: 18, mass: 0.4 }
    const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [8, -8]), springConfig)
    const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), springConfig)
    const glowX = useTransform(mouseX, [-0.5, 0.5], ["0%", "100%"])
    const glowY = useTransform(mouseY, [-0.5, 0.5], ["0%", "100%"])
    const glowBackground = useTransform(
        [glowX, glowY],
        ([x, y]) =>
            `radial-gradient(280px circle at ${x} ${y}, rgba(234,179,8,0.15), transparent 70%)`
    )

    const handleMouseMove = (e) => {
        if (!ref.current) return
        const rect = ref.current.getBoundingClientRect()
        mouseX.set((e.clientX - rect.left) / rect.width - 0.5)
        mouseY.set((e.clientY - rect.top) / rect.height - 0.5)
    }

    const handleMouseLeave = () => {
        mouseX.set(0)
        mouseY.set(0)
    }

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true, margin: "-50px" }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                rotateX,
                rotateY,
                transformPerspective: 1000,
                transformStyle: "preserve-3d"
            }}
            className="group relative bg-zinc-900/60 backdrop-blur-md border border-white/10 hover:border-yellow-500/30 rounded-3xl p-7 shadow-2xl transition-colors duration-500 overflow-hidden h-full flex flex-col cursor-pointer"
        >
            {/* Mouse-following radial glow */}
            <motion.div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ background: glowBackground }}
            />

            {/* Icon */}
            <div
                className="relative w-14 h-14 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center mb-6 group-hover:bg-yellow-500 group-hover:border-yellow-500 transition-all duration-500"
                style={{ transform: "translateZ(30px)" }}
            >
                <Icon
                    className="w-6 h-6 text-yellow-500 group-hover:text-black transition-colors duration-500"
                    strokeWidth={1.75}
                />
            </div>

            {/* Title */}
            <h3
                className="text-xl font-bold text-white tracking-wide mb-3 group-hover:text-yellow-500 transition-colors duration-300"
                style={{ transform: "translateZ(20px)" }}
            >
                {item.title}
            </h3>

            {/* Description */}
            <p
                className="text-gray-400 text-sm leading-relaxed font-light"
                style={{ transform: "translateZ(10px)" }}
            >
                {item.description}
            </p>
        </motion.div>
    )
}

export default ServiceCard
