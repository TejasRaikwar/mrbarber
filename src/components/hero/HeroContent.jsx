import { motion } from "framer-motion"

const HeroContent = ({ slide }) => {
  return (
    <div className="max-w-3xl">
      
      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-yellow-500 uppercase tracking-[6px] mb-5 font-medium"
      >
        {slide.subtitle}
      </motion.p>

      {/* Heading */}
      <motion.h1
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 1,
          delay: 0.2,
        }}
        className="text-5xl md:text-7xl font-bold text-white leading-tight mb-6"
      >
        {slide.title}
      </motion.h1>

      {/* Description */}
      <motion.p
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 1,
          delay: 0.4,
        }}
        className="text-lg md:text-2xl text-gray-300 leading-relaxed mb-10"
      >
        {slide.description}
      </motion.p>

      {/* Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 1,
          delay: 0.6,
        }}
        className="flex flex-wrap gap-5"
      >
        <button className="bg-yellow-500 hover:bg-yellow-600 text-black px-8 py-4 rounded-lg font-semibold transition-all duration-300 shadow-lg shadow-yellow-500/20">
          Book Appointment
        </button>

        <button className="border border-white/30 hover:border-yellow-500 text-white px-8 py-4 rounded-lg font-semibold transition-all duration-300 backdrop-blur-sm">
          Explore Services
        </button>
      </motion.div>
    </div>
  )
}

export default HeroContent