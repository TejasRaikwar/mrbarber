import BeforeAfterCard from "./BeforeAfterCard"
import SectionHeading from "@/components/ui/SectionHeading"
import { useSiteContent } from "@/context/SiteContentContext"

const BeforeAfterSection = () => {
    const { transformations } = useSiteContent()
    if (!transformations || transformations.length === 0) return null

    // Card expects `before` / `after`; map API fields.
    const items = transformations.map((t) => ({
        id: t.id,
        title: t.title,
        before: t.beforeImageUrl,
        after: t.afterImageUrl
    }))

    return (
        <section id="transformations" className="py-16 scroll-mt-20">
            <div className="max-w-7xl mx-auto px-6">
                <SectionHeading
                    eyebrow="Transformations"
                    title="Before & After Results"
                    description="Experience professional grooming transformations crafted with precision and style."
                />
            </div>

            <div
                className={`grid grid-cols-1 ${
                    items.length > 1
                        ? "md:grid-cols-2 max-w-7xl"
                        : "max-w-5xl"
                } gap-10 mx-auto justify-center px-6`}
            >
                {items.map((item) => (
                    <BeforeAfterCard key={item.id} item={item} />
                ))}
            </div>
        </section>
    )
}

export default BeforeAfterSection
