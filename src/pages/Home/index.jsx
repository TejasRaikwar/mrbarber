import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"

import SuperFlowSlider from "@/components/hero/SuperFlowSlider"
import MarqueeStrip from "@/components/marquee/MarqueeStrip"
import ServicesSection from "@/components/services/ServicesSection"
import BeforeAfterSection from "@/components/transformations/BeforeAfterSection"
import HairProfilesSection from "@/components/profiles/HairProfilesSection"
import ReviewsSection from "@/components/reviews/ReviewsSection"
import ContactSection from "@/components/contact/ContactSection"
import Preloader from "@/components/ui/Preloader"

const Home = () => {
  const [loading, setLoading] = useState(true)
  const location = useLocation()

  // Lock body scroll while the preloader is on screen so the page below
  // can't be scrolled to (which would also expose the footer).
  useEffect(() => {
    if (loading) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [loading])

  // Scroll to the requested section when arriving from another route.
  useEffect(() => {
    if (loading) return
    const target = location.state?.scrollTo
    if (!target) return
    requestAnimationFrame(() => {
      const el = document.getElementById(target)
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" })
    })
  }, [location.state, loading])

  return (
    <>
      <Preloader onComplete={() => setLoading(false)} />
      <SuperFlowSlider />
      <MarqueeStrip />
      <ServicesSection />
      <BeforeAfterSection />
      <HairProfilesSection />
      <ReviewsSection />
      <ContactSection />
    </>
  )
}

export default Home
