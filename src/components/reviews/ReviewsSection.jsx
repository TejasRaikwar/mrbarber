import ReviewCard from "./ReviewCard"
import { reviews } from "./reviews"
import SectionHeading from "@/components/ui/SectionHeading"
import "./reviews.css"

const ReviewsSection = () => {
    const averageRating = (
        reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    ).toFixed(1)

    // Duplicate the list so the marquee loops seamlessly
    const loop = [...reviews, ...reviews]

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

            {/* Marquee */}
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
