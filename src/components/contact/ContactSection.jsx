import LocationCard from "./LocationCard"
import SectionHeading from "@/components/ui/SectionHeading"
import { useSiteContent } from "@/context/SiteContentContext"

const ContactSection = () => {
    const { locations } = useSiteContent()
    if (!locations || locations.length === 0) return null

    // Map API → LocationCard expected shape
    const items = locations.map((l) => ({
        id: l.id,
        city: l.city,
        image: l.imageUrl,
        address: (l.address || "").split(/\r?\n/).filter(Boolean),
        contacts: l.contacts || [],
        whatsapp: l.whatsapp
    }))

    return (
        <section id="contact" className="py-16 relative scroll-mt-20">
            <div className="max-w-7xl mx-auto px-6 relative">
                <SectionHeading
                    eyebrow="Get In Touch"
                    title="Visit Our Studio"
                    description="Drop by for a consultation or book a home trial — our experts are ready to craft the right look for you."
                />

                <div className="space-y-8">
                    {items.map((item, index) => (
                        <LocationCard key={item.id} item={item} index={index} />
                    ))}
                </div>
            </div>
        </section>
    )
}

export default ContactSection
