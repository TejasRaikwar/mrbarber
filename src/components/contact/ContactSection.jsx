import LocationCard from "./LocationCard"
import { locations } from "./locations"
import SectionHeading from "@/components/ui/SectionHeading"

const ContactSection = () => {
    return (
        <section id="contact" className="py-16 relative scroll-mt-20">
            <div className="max-w-7xl mx-auto px-6 relative">
                <SectionHeading
                    eyebrow="Get In Touch"
                    title="Visit Our Studio"
                    description="Drop by for a consultation or book a home trial — our experts are ready to craft the right look for you."
                />

                <div className="space-y-8">
                    {locations.map((item, index) => (
                        <LocationCard
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

export default ContactSection
