import { useState, useRef } from "react"
import { motion } from "framer-motion"

const BeforeAfterCard = ({ item }) => {
  const [sliderPosition, setSliderPosition] = useState(50)
  const [isDragging, setIsDragging] = useState(false)
  const containerRef = useRef(null)

  const handleMove = (clientX) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = clientX - rect.left
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100))
    setSliderPosition(percentage)
  }

  const handleStart = (clientX) => {
    setIsDragging(true)
    handleMove(clientX)
  }

  const handleMouseMove = (e) => {
    if (!isDragging) return
    handleMove(e.clientX)
  }

  const handleTouchMove = (e) => {
    if (!isDragging) return
    if (e.touches[0]) {
      handleMove(e.touches[0].clientX)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      viewport={{ once: true }}
      className="bg-zinc-900/60 backdrop-blur-md rounded-3xl overflow-hidden border border-white/10 hover:border-yellow-500/20 transition-all duration-500 group shadow-2xl"
    >
      {/* Slider Interactive Window */}
      <div 
        ref={containerRef}
        className="relative h-[400px] md:h-[580px] w-full overflow-hidden cursor-ew-resize select-none"
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
        onMouseDown={(e) => handleStart(e.clientX)}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
        onTouchStart={(e) => { if (e.touches[0]) handleStart(e.touches[0].clientX) }}
        onTouchEnd={() => setIsDragging(false)}
      >
        {/* After Image (Base Layer) */}
        <div className="absolute inset-0 h-full w-full bg-zinc-950">
          <img 
            src={item.after} 
            alt="After transformation" 
            className="h-full w-full object-cover select-none pointer-events-none"
          />
          {/* After Watermark Badge */}
          <div className="absolute right-4 top-4 z-10 bg-black/70 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider text-yellow-500">
            After
          </div>
        </div>

        {/* Before Image (Overlay Layer) */}
        <div 
          className="absolute inset-0 h-full w-full z-10"
          style={{
            clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)`,
            WebkitClipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)`
          }}
        >
          <img 
            src={item.before} 
            alt="Before transformation" 
            className="h-full w-full object-cover select-none pointer-events-none"
          />
          {/* Before Watermark Badge */}
          <div className="absolute left-4 top-4 z-10 bg-black/70 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider text-white">
            Before
          </div>
        </div>

        {/* Slider Handle Line */}
        <div 
          className="absolute top-0 bottom-0 w-0.5 bg-yellow-500 z-20 pointer-events-none shadow-[0_0_10px_rgba(234,179,8,0.5)]"
          style={{ left: `${sliderPosition}%` }}
        >
          {/* Slider Central Handle Indicator */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-yellow-500 text-black border-4 border-black/80 flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-110 pointer-events-none">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2.5" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="w-4 h-4"
            >
              <path d="m8 18-6-6 6-6" />
              <path d="m16 6 6 6-6 6" />
            </svg>
          </div>
        </div>
      </div>

      {/* Description Info */}
      <div className="p-6 border-t border-white/5 bg-zinc-950/40">
        <h3 className="text-xl font-bold text-white tracking-wide group-hover:text-yellow-500 transition-colors duration-300">  
          {item.title}
        </h3>
        <p className="text-gray-400 text-sm mt-1 font-light">
          Drag the handle or click anywhere to compare the results
        </p>
      </div>
    </motion.div>
  )
}

export default BeforeAfterCard
