import HairProfileCard from "./HairProfileCard"
import SectionHeading from "@/components/ui/SectionHeading"
import { useSiteContent } from "@/context/SiteContentContext"

const HairProfilesSection = () => {
    const { hairProfiles } = useSiteContent()
    if (!hairProfiles || hairProfiles.length === 0) return null

    const items = hairProfiles.map((p) => ({
        id: p.id,
        title: p.title,
        description: p.description,
        before: p.beforeImageUrl,
        after: p.afterImageUrl
    }))

    return (
        <section id="profiles" className="py-16 scroll-mt-20">
            <div className="max-w-7xl mx-auto px-6">
                <SectionHeading
                    eyebrow="Hair Profiles"
                    title="Application for Different Hair Profiles"
                    description="Tailored solutions for every concern — from crown thinning to receding temples, see how each profile transforms."
                />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {items.map((item, index) => (
                        <HairProfileCard key={item.id} item={item} index={index} />
                    ))}
                </div>
            </div>
        </section>
    )
}

export default HairProfilesSection
