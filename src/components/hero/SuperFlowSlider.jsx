import { useState, useEffect } from "react"
import { AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { clipPaths, sliceVariants } from "./sliderVariants"
import SuperFlowSlice from "./SuperFlowSlice"
import SuperFlowContent from "./SuperFlowContent"
import { useSiteContent } from "@/context/SiteContentContext"

const SuperFlowSlider = () => {
  const { heroSlides } = useSiteContent()
  const [[page, direction], setPage] = useState([0, 0])
  const [isTransitioning, setIsTransitioning] = useState(false)

  // Normalise API rows into the shape SuperFlowContent expects.
  const slides = (heroSlides || []).map((s) => ({
    id: s.id,
    image: s.imageUrl,
    subtitle: s.subtitle,
    title: s.title,
    description: s.description,
    primaryCtaLabel: s.primaryCtaLabel,
    primaryCtaHref: s.primaryCtaHref,
    secondaryCtaLabel: s.secondaryCtaLabel,
    secondaryCtaHref: s.secondaryCtaHref
  }))

  const activeIndex = slides.length > 0 ? page % slides.length : 0

  // Auto-advance every 5 seconds; reset timer whenever user navigates manually
  useEffect(() => {
    if (slides.length <= 1) return
    const id = setTimeout(() => {
      if (!isTransitioning) {
        setIsTransitioning(true)
        setPage([(activeIndex + 1) % slides.length, 1])
      }
    }, 5000)
    return () => clearTimeout(id)
  }, [activeIndex, isTransitioning, slides.length])

  if (slides.length === 0) {
    return (
      <section className="relative h-screen w-full bg-black flex items-center justify-center">
        <p className="text-gray-500 text-sm">No hero slides configured.</p>
      </section>
    )
  }

  const currentSlide = slides[activeIndex]

  const handleNext = () => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setPage([(activeIndex + 1) % slides.length, 1])
  }

  const handlePrev = () => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setPage([(activeIndex - 1 + slides.length) % slides.length, -1])
  }

  const handleDotClick = (index) => {
    if (isTransitioning || index === activeIndex) return
    setIsTransitioning(true)
    setPage([index, index > activeIndex ? 1 : -1])
  }

  return (
    <section className="relative h-screen w-full overflow-hidden bg-black select-none">
      {/* Background Slices Layer */}
      <div className="absolute inset-0 z-0 h-full w-full">
        <AnimatePresence
          initial={false}
          custom={direction}
          onExitComplete={() => setIsTransitioning(false)}
        >
          <div key={activeIndex} className="absolute inset-0 h-full w-full">
            {clipPaths.map((clipPath, sliceIndex) => (
              <SuperFlowSlice
                key={sliceIndex}
                sliceIndex={sliceIndex}
                clipPath={clipPath}
                direction={direction}
                variants={sliceVariants[sliceIndex]}
                imageSrc={currentSlide.image}
                imageAlt={currentSlide.title}
              />
            ))}
          </div>
        </AnimatePresence>
      </div>

      {/* Vignette */}
      <div className="absolute bottom-0 left-0 w-full h-44 bg-gradient-to-t from-black to-transparent z-10 pointer-events-none" />

      {/* Content */}
      <div className="relative z-20 flex h-full items-center">
        <div className="max-w-7xl mx-auto px-6 w-full">
          <AnimatePresence mode="wait">
            <SuperFlowContent key={activeIndex} slide={currentSlide} />
          </AnimatePresence>
        </div>
      </div>

      {/* Nav arrows */}
      {slides.length > 1 && (
        <div className="absolute right-6 md:right-12 bottom-10 md:bottom-12 z-30 flex items-center gap-3">
          <button
            onClick={handlePrev}
            disabled={isTransitioning}
            className="cursor-pointer flex items-center justify-center w-12 h-12 rounded-full border border-white/10 bg-white/5 hover:bg-yellow-500 hover:border-yellow-500 hover:text-black text-white transition-all duration-300 backdrop-blur-md disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-x-0.5 active:translate-x-0"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={handleNext}
            disabled={isTransitioning}
            className="cursor-pointer flex items-center justify-center w-12 h-12 rounded-full border border-white/10 bg-white/5 hover:bg-yellow-500 hover:border-yellow-500 hover:text-black text-white transition-all duration-300 backdrop-blur-md disabled:opacity-50 disabled:cursor-not-allowed hover:translate-x-0.5 active:translate-x-0"
            aria-label="Next slide"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Pagination dots */}
      {slides.length > 1 && (
        <div className="absolute left-6 md:left-12 bottom-12 z-30 flex items-center gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              disabled={isTransitioning}
              className={`cursor-pointer h-2 transition-all duration-300 rounded-full ${
                activeIndex === index
                  ? "w-8 bg-yellow-500 shadow-lg shadow-yellow-500/50"
                  : "w-2 bg-white/30 hover:bg-white/60"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  )
}

export default SuperFlowSlider
