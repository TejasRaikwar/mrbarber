import HairProfileCard from "./HairProfileCard"
import { hairProfiles } from "./profiles"
import SectionHeading from "@/components/ui/SectionHeading"

const HairProfilesSection = () => {
    return (
        <section id="profiles" className="py-16 scroll-mt-20">
            <div className="max-w-7xl mx-auto px-6">
                <SectionHeading
                    eyebrow="Hair Profiles"
                    title="Application for Different Hair Profiles"
                    description="Tailored solutions for every concern — from crown thinning to receding temples, see how each profile transforms."
                />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {hairProfiles.map((item, index) => (
                        <HairProfileCard
                            key={item.id}
                            item={item}
                            index={index}
                        />
                    ))}
                </div>
            </div>
        </section>
    )
}

export default HairProfilesSection
