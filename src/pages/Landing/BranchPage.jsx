import { MapPin, Clock, Phone, Mail } from "lucide-react"
import { useSeo } from "@/lib/useSeo"
import { SITE, branchPath, branchAddressLine, findSeoRoute, directionsUrl } from "@/seo/siteSeo"
import BeforeAfterSection from "@/components/transformations/BeforeAfterSection"
import ReviewsSection from "@/components/reviews/ReviewsSection"
import { LandingHero, ContentSection, ServiceLinks } from "./LandingParts"

/** One page per studio, so each location can rank for "hair patch near <area>". */
const BranchPage = ({ branch }) => {
    const path = branchPath(branch)
    const route = findSeoRoute(path)

    useSeo({
        title: route.title,
        description: route.description,
        path,
        jsonLd: route.pageJsonLd
    })

    const rows = [
        { Icon: MapPin, content: branchAddressLine(branch) },
        { Icon: Clock, content: SITE.hours.label },
        {
            Icon: Phone,
            content: (
                <a href={`tel:${SITE.phone.replace(/\s/g, "")}`} className="hover:text-(--brand) transition-colors">
                    {SITE.phone}
                </a>
            )
        },
        {
            Icon: Mail,
            content: (
                <a href={`mailto:${SITE.email}`} className="hover:text-(--brand) transition-colors">
                    {SITE.email}
                </a>
            )
        }
    ]

    return (
        <>
            <LandingHero
                eyebrow={branch.name}
                title={`Hair Patch in ${branch.area}, Nagpur`}
                intro={branch.intro}
            />

            <ContentSection title="Address & hours">
                <div className="bg-card border border-border rounded-3xl p-7 md:p-9 max-w-2xl">
                    <ul className="space-y-4">
                        {rows.map(({ Icon, content }, i) => (
                            <li key={i} className="flex items-start gap-3 text-foreground/85">
                                <Icon className="w-5 h-5 text-(--brand) shrink-0 mt-0.5" strokeWidth={1.75} />
                                <span>{content}</span>
                            </li>
                        ))}
                    </ul>
                    <a
                        href={directionsUrl(branch)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex mt-7 bg-(--brand) hover:bg-(--brand-hover) text-(--brand-foreground) px-6 py-3 rounded-lg font-bold transition-colors"
                    >
                        Get directions
                    </a>
                </div>
            </ContentSection>

            <ContentSection title={`Services at our ${branch.area} studio`}>
                <ServiceLinks />
            </ContentSection>

            <BeforeAfterSection />
            <ReviewsSection />
        </>
    )
}

export default BranchPage
