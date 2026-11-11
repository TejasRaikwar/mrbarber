import { CheckCircle2 } from "lucide-react"
import { useSeo } from "@/lib/useSeo"
import { SITE, servicePath, findSeoRoute } from "@/seo/siteSeo"
import BeforeAfterSection from "@/components/transformations/BeforeAfterSection"
import ReviewsSection from "@/components/reviews/ReviewsSection"
import { LandingHero, ContentSection, FaqList, BranchCards, ServiceLinks } from "./LandingParts"

/** One page per service (/hair-patch-nagpur, …), content from src/seo/siteSeo.js. */
const ServicePage = ({ service }) => {
    const path = servicePath(service)
    const route = findSeoRoute(path)

    useSeo({
        title: route.title,
        description: route.description,
        path,
        jsonLd: route.pageJsonLd
    })

    return (
        <>
            <LandingHero eyebrow={`${SITE.name} · ${SITE.city}`} title={service.h1} intro={service.intro} />

            <ContentSection title={`Why choose ${service.name.toLowerCase()} at Mr Barber`}>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {service.highlights.map((h) => (
                        <li key={h} className="flex items-start gap-3 bg-card border border-border rounded-2xl px-5 py-4">
                            <CheckCircle2 className="w-5 h-5 text-(--brand) shrink-0 mt-0.5" strokeWidth={2} />
                            <span className="text-foreground/90">{h}</span>
                        </li>
                    ))}
                </ul>
            </ContentSection>

            <ContentSection title="How it works">
                <ol className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {service.steps.map((step, i) => {
                        const [head, ...rest] = step.split(" — ")
                        return (
                            <li key={step} className="bg-card border border-border rounded-2xl p-6">
                                <span className="inline-flex w-9 h-9 items-center justify-center rounded-full bg-(--brand) text-(--brand-foreground) font-bold mb-3">
                                    {i + 1}
                                </span>
                                <p className="font-semibold text-foreground mb-1">{head}</p>
                                {rest.length > 0 && <p className="text-muted-foreground text-sm">{rest.join(" — ")}</p>}
                            </li>
                        )
                    })}
                </ol>
            </ContentSection>

            <BeforeAfterSection />

            <ContentSection title={`${service.name} — frequently asked questions`}>
                <FaqList faqs={service.faqs} />
            </ContentSection>

            <ReviewsSection />

            <ContentSection title={`Visit Mr Barber in ${SITE.city}`}>
                <BranchCards />
            </ContentSection>

            <ContentSection title="Other services">
                <ServiceLinks exclude={service.slug} />
            </ContentSection>
        </>
    )
}

export default ServicePage
