import SuperFlowSlider from "@/components/hero/SuperFlowSlider"
import ServicesSection from "@/components/services/ServicesSection"
import BeforeAfterSection from "@/components/transformations/BeforeAfterSection"
import HairProfilesSection from "@/components/profiles/HairProfilesSection"
import ReviewsSection from "@/components/reviews/ReviewsSection"

const Home = () => {
  return (
    <>
      <SuperFlowSlider />
      <ServicesSection />
      <BeforeAfterSection />
      <HairProfilesSection />
      <ReviewsSection />
    </>
  )
}

export default Home
