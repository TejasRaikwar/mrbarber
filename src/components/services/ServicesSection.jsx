import { Link } from "react-router-dom"
import ServiceCard from "./ServiceCard"
import { findServiceForTitle, servicePath } from "@/seo/siteSeo"
import SectionHeading from "@/components/ui/SectionHeading"
import { useSiteContent } from "@/context/SiteContentContext"
import { resolveIcon } from "@/lib/iconMap"

const ServicesSection = () => {
    const { services } = useSiteContent()
    if (!services || services.length === 0) return null

    const items = services.map((s) => {
        const page = findServiceForTitle(s.title)
        return { ...s, Icon: resolveIcon(s.iconName), to: page ? servicePath(page) : null }
    })

    return (
        <section id="services" className="py-16 relative scroll-mt-20">
            <div className="max-w-7xl mx-auto px-6 relative">
                <SectionHeading
                    eyebrow="Our Services"
                    title="Hair Patch & Hair Replacement Services in Nagpur"
                    description="From premium hair systems to expert styling — a full-service studio crafted around your look and comfort."
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-8 gap-6">
                    {items.map((item, index) => (
                        <div
                            key={item.id}
                            className={`lg:col-span-2 ${
                                index === 4 ? "lg:col-start-2" : ""
                            }`}
                        >
                            {item.to ? (
                                <Link to={item.to} className="block h-full rounded-3xl">
                                    <ServiceCard item={item} index={index} />
                                </Link>
                            ) : (
                                <ServiceCard item={item} index={index} />
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default ServicesSection
