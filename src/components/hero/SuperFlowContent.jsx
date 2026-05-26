import { motion } from "framer-motion"
import { Scissors } from "lucide-react"
import { contentVariants } from "./sliderVariants"

const SuperFlowContent = ({ slide }) => {
  return (
    <motion.div
      variants={contentVariants.container}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="max-w-3xl"
    >
      {/* Subtitle */}
      <motion.p
        variants={contentVariants.subtitle}
        className="text-yellow-500 uppercase tracking-[6px] mb-4 font-semibold text-sm md:text-base flex items-center gap-2"
      >
        <Scissors className="h-4 w-4 text-yellow-500 inline md:hidden" />
        {slide.subtitle}
      </motion.p>

      {/* Title */}
      <motion.h1
        variants={contentVariants.title}
        className="text-4xl md:text-7xl font-extrabold text-white leading-tight mb-5 tracking-tight"
      >
        {slide.title}
      </motion.h1>

      {/* Description */}
      <motion.p
        variants={contentVariants.description}
        className="text-base md:text-xl text-gray-300/90 leading-relaxed mb-8 max-w-2xl font-light"
      >
        {slide.description}
      </motion.p>

      {/* Action Buttons */}
      <motion.div
        variants={contentVariants.buttons}
        className="flex flex-wrap gap-4"
      >
        <button className="cursor-pointer bg-yellow-500 hover:bg-yellow-600 text-black px-7 py-3.5 rounded-lg font-bold transition-all duration-300 shadow-lg shadow-yellow-500/10 hover:shadow-yellow-500/20 hover:-translate-y-0.5 active:translate-y-0">
          Book Appointment
        </button>
        <button className="cursor-pointer border border-white/20 hover:border-yellow-500 hover:text-yellow-500 text-white px-7 py-3.5 rounded-lg font-bold transition-all duration-300 backdrop-blur-sm hover:-translate-y-0.5 active:translate-y-0">
          Explore Services
        </button>
      </motion.div>
    </motion.div>
  )
}

export default SuperFlowContent

