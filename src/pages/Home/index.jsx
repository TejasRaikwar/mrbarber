import { useEffect, useMemo, useState } from "react"
import { useLocation } from "react-router-dom"

import SuperFlowSlider from "@/components/hero/SuperFlowSlider"
import MarqueeStrip from "@/components/marquee/MarqueeStrip"
import ServicesSection from "@/components/services/ServicesSection"
import ReelsSection from "@/components/reels/ReelsSection"
import BeforeAfterSection from "@/components/transformations/BeforeAfterSection"
import HairProfilesSection from "@/components/profiles/HairProfilesSection"
import ReviewsSection from "@/components/reviews/ReviewsSection"
import ContactSection from "@/components/contact/ContactSection"
import Preloader from "@/components/ui/Preloader"
import { useSiteContent } from "@/context/SiteContentContext"
import { useSeo } from "@/lib/useSeo"
import { SITE } from "@/seo/siteSeo"

// Services the admin lists on the page, as a catalogue on the business entity.
const servicesJsonLd = (services) =>
  services?.length
    ? {
        "@context": "https://schema.org",
        "@type": "Organization",
        "@id": `${SITE.url}/#organization`,
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Hair services",
          itemListElement: services.map((s) => ({
            "@type": "Offer",
            itemOffered: { "@type": "Service", name: s.title, description: s.description || undefined }
          }))
        }
      }
    : null

const Home = () => {
  const [loading, setLoading] = useState(true)
  const location = useLocation()
  const { settings, services } = useSiteContent()

  // Admin "Search & Sharing" settings override the built-in defaults.
  const extraJsonLd = useMemo(() => servicesJsonLd(services), [services])
  useSeo({
    title: settings?.pageTitle || SITE.defaultTitle,
    description: settings?.metaDescription || SITE.defaultDescription,
    image: settings?.ogImageUrl || undefined,
    path: "/",
    extraJsonLd
  })

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
      <ReelsSection />
      <BeforeAfterSection />
      <HairProfilesSection />
      <ReviewsSection />
      <ContactSection />
    </>
  )
}

export default Home
