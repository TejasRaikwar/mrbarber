import ReviewCard from "./ReviewCard"
import SectionHeading from "@/components/ui/SectionHeading"
import { useSiteContent } from "@/context/SiteContentContext"
import "./reviews.css"

const ReviewsSection = () => {
    const { reviews } = useSiteContent()
    if (!reviews || reviews.length === 0) return null

    // Map API → ReviewCard's expected shape
    const items = reviews.map((r) => ({
        id: r.id,
        name: r.authorName,
        location: r.location,
        rating: r.rating,
        quote: r.quote,
        initials: r.initials,
        avatarUrl: r.avatarUrl
    }))

    const averageRating = (
        items.reduce((sum, r) => sum + r.rating, 0) / items.length
    ).toFixed(1)

    const loop = [...items, ...items]

    return (
        <section id="reviews" className="py-16 relative overflow-hidden scroll-mt-20">
            <div className="max-w-7xl mx-auto px-6 relative">
                <SectionHeading
                    eyebrow="Testimonials"
                    title="What Our Customers Say"
                    description={
                        <p className="text-gray-400 max-w-2xl mx-auto">
                            Real stories from men who&apos;ve transformed their look —
                            averaging{" "}
                            <span className="text-yellow-500 font-semibold">
                                {averageRating} / 5
                            </span>{" "}
                            across hundreds of reviews.
                        </p>
                    }
                />
            </div>

            <div className="reviews-marquee group/marquee relative">
                <div className="reviews-marquee__track">
                    {loop.map((item, index) => (
                        <div
                            key={`${item.id}-${index}`}
                            className="reviews-marquee__item"
                        >
                            <ReviewCard item={item} index={0} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default ReviewsSection
