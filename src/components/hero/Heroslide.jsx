import { motion } from "framer-motion"

import HeroContent from "./HeroContent"

const HeroSlide = ({ slide }) => {
  return (
    <div className="relative h-screen w-full overflow-hidden">
      
      {/* Background Image */}
      <motion.img
        src={slide.image}
        alt={slide.title}
        initial={{ scale: 1 }}
        animate={{ scale: 1.12 }}
        transition={{
          duration: 7,
          ease: "linear",
        }}
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/75 z-10" />

      {/* Content */}
      <div className="relative z-20 flex h-full items-center">
        <div className="max-w-7xl mx-auto px-6 w-full">
          <HeroContent slide={slide} />
        </div>
      </div>
    </div>
  )
}

export default HeroSlide