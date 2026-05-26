import { motion } from "framer-motion"

const AmbientBackground = () => {
    return (
        <div className="fixed inset-0 -z-10 overflow-hidden bg-black pointer-events-none">
            {/* Faint dot grid */}
            <div
                className="absolute inset-0 opacity-[0.035]"
                style={{
                    backgroundImage:
                        "radial-gradient(circle, white 1px, transparent 1px)",
                    backgroundSize: "32px 32px"
                }}
            />

            {/* Top vignette */}
            <div className="absolute top-0 inset-x-0 h-[40vh] bg-gradient-to-b from-yellow-500/[0.04] via-transparent to-transparent" />

            {/* Diagonal barber-pole accent */}
            <div
                className="absolute top-1/2 -right-32 w-[60vw] h-[140%] -translate-y-1/2 opacity-[0.02] rotate-12"
                style={{
                    backgroundImage:
                        "repeating-linear-gradient(90deg, #eab308 0 2px, transparent 2px 80px)"
                }}
            />

            {/* Drifting orbs */}
            <motion.div
                className="absolute top-[15%] -left-40 w-[28rem] h-[28rem] rounded-full bg-yellow-500/[0.07] blur-3xl"
                animate={{ x: [0, 80, 0], y: [0, -40, 0] }}
                transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
                className="absolute top-[55%] -right-40 w-[32rem] h-[32rem] rounded-full bg-yellow-500/[0.05] blur-3xl"
                animate={{ x: [0, -60, 0], y: [0, 40, 0] }}
                transition={{ duration: 28, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
                className="absolute bottom-[8%] left-[35%] w-[24rem] h-[24rem] rounded-full bg-yellow-500/[0.04] blur-3xl"
                animate={{ x: [0, 50, 0], y: [0, -30, 0] }}
                transition={{
                    duration: 25,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 5
                }}
            />
        </div>
    )
}

export default AmbientBackground
