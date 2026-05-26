import BeforeAfterCard from "./BeforeAfterCard"
import { transformations } from "./transformations"

const BeforeAfterSection = () => {
    return (
        <section className="bg-black pt-12 pb-24">
            <div className="max-w-7xl mx-auto px-6">
                {/* Heading */}
                <div className="text-center mb-12">

                    <p className="text-yellow-500 uppercase tracking-[5px] mb-4">
                        Transformations
                    </p>

                    <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
                        Before & After Results
                    </h2>

                    <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                        Experience professional grooming transformations
                        crafted with precision and style.
                    </p>
                </div>
            </div>

            {/* Cards */}
            <div className={`grid grid-cols-1 ${transformations.length > 1 ? "md:grid-cols-2 max-w-7xl" : "max-w-5xl"} gap-10 mx-auto justify-center`}>
                {transformations.map((item) => (
                    <BeforeAfterCard
                        key={item.id}
                        item={item}
                    />
                ))}
            </div>
        </section >
    )
}

export default BeforeAfterSection
