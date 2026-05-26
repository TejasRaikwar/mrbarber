import ReviewCard from "./ReviewCard"
import { reviews } from "./reviews"
import "./reviews.css"

const ReviewsSection = () => {
    const averageRating = (
        reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    ).toFixed(1)

    // Duplicate the list so the marquee loops seamlessly
    const loop = [...reviews, ...reviews]

    return (
        <section className="bg-black pt-12 pb-24 relative overflow-hidden">
            {/* Subtle background glow */}
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-yellow-500/[0.04] rounded-full blur-3xl pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 relative mb-14">
                {/* Heading */}
                <div className="text-center">
                    <p className="text-yellow-500 uppercase tracking-[5px] mb-4">
                        Testimonials
                    </p>

                    <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
                        What Our Customers Say
                    </h2>

                    <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                        Real stories from men who&apos;ve transformed their look —
                        averaging{" "}
                        <span className="text-yellow-500 font-semibold">
                            {averageRating} / 5
                        </span>{" "}
                        across hundreds of reviews.
                    </p>
                </div>
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
