import { useEffect } from "react"
import { useLocation } from "react-router-dom"

import SuperFlowSlider from "@/components/hero/SuperFlowSlider"
import ServicesSection from "@/components/services/ServicesSection"
import BeforeAfterSection from "@/components/transformations/BeforeAfterSection"
import HairProfilesSection from "@/components/profiles/HairProfilesSection"
import ReviewsSection from "@/components/reviews/ReviewsSection"
import ContactSection from "@/components/contact/ContactSection"

const Home = () => {
  const location = useLocation()

  // Scroll to the requested section when arriving from another route.
  useEffect(() => {
    const target = location.state?.scrollTo
    if (!target) return
    // Wait one frame so the target section is mounted.
    requestAnimationFrame(() => {
      const el = document.getElementById(target)
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" })
    })
  }, [location.state])

  return (
    <>
      <SuperFlowSlider />
      <ServicesSection />
      <BeforeAfterSection />
      <HairProfilesSection />
      <ReviewsSection />
      <ContactSection />
    </>
  )
}

export default Home
