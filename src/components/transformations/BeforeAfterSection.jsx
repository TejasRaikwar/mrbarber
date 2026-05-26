import BeforeAfterCard from "./BeforeAfterCard"
import { transformations } from "./transformations"
import SectionHeading from "@/components/ui/SectionHeading"

const BeforeAfterSection = () => {
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
                    transformations.length > 1
                        ? "md:grid-cols-2 max-w-7xl"
                        : "max-w-5xl"
                } gap-10 mx-auto justify-center px-6`}
            >
                {transformations.map((item) => (
                    <BeforeAfterCard key={item.id} item={item} />
                ))}
            </div>
        </section>
    )
}

export default BeforeAfterSection
