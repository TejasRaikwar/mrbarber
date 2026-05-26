import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Scissors } from "lucide-react"

const letterVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.05 + 0.3,
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
}

const logoText = "MR BARBER"

const Preloader = ({ onComplete }) => {
  const [isExiting, setIsExiting] = useState(false)

  useEffect(() => {
    // Automatically trigger exit animation after 2 seconds
    const timer = setTimeout(() => {
      setIsExiting(true)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <AnimatePresence onExitComplete={onComplete}>
      {!isExiting && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{
            y: "-100%",
            transition: {
              duration: 1.1,
              ease: [0.76, 0, 0.24, 1], // Pure cinematic cubic-bezier ease
            },
          }}
          className="fixed inset-0 bg-black z-[9999] flex flex-col items-center justify-center select-none"
        >
          {/* Main loader content */}
          <div className="flex flex-col items-center gap-6">
            {/* Animated Scissors Icon */}
            <motion.div
              initial={{ scale: 0.6, rotate: -20, opacity: 0 }}
              animate={{ 
                scale: [0.6, 1.1, 1], 
                rotate: [-20, 10, 0], 
                opacity: 1 
              }}
              transition={{
                duration: 1.2,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="relative flex items-center justify-center"
            >
              <Scissors className="w-16 h-16 text-yellow-500" strokeWidth={1.5} />
              
              {/* Outer decorative glowing ring */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1.2, opacity: [0, 0.25, 0] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute inset-0 rounded-full border border-yellow-500/30 blur-sm w-16 h-16"
              />
            </motion.div>

            {/* Letter by letter text reveal */}
            <div className="flex items-center gap-1.5 overflow-hidden py-1">
              {logoText.split("").map((letter, i) => (
                <motion.span
                  key={i}
                  custom={i}
                  variants={letterVariants}
                  initial="hidden"
                  animate="visible"
                  className={`text-2xl md:text-3xl font-bold tracking-widest text-white ${
                    letter === " " ? "w-3" : ""
                  }`}
                >
                  {letter}
                </motion.span>
              ))}
            </div>

            {/* Subtle premium sub-bar */}
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: "80px", opacity: 0.4 }}
              transition={{ delay: 1, duration: 0.8, ease: "easeOut" }}
              className="h-px bg-yellow-500"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default Preloader
