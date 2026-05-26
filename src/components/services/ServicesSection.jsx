import ServiceCard from "./ServiceCard"
import { services } from "./services"

const ServicesSection = () => {
    return (
        <section className="bg-black pt-20 pb-24 relative overflow-hidden">
            {/* Subtle ambient glow */}
            <div className="absolute top-0 right-0 w-125 h-125 bg-yellow-500/4 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-125 h-125 bg-yellow-500/3 rounded-full blur-3xl pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 relative">
                {/* Heading */}
                <div className="text-center mb-14">
                    <p className="text-yellow-500 uppercase tracking-[5px] mb-4">
                        Our Services
                    </p>

                    <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
                        Everything Your Hair Needs
                    </h2>

                    <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                        From premium hair systems to expert styling — a full-service
                        studio crafted around your look and comfort.
                    </p>
                </div>

                {/* Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-8 gap-6">
                    {services.map((item, index) => (
                        <div
                            key={item.id}
                            className={`lg:col-span-2 ${
                                index === 4 ? "lg:col-start-2" : ""
                            }`}
                        >
                            <ServiceCard item={item} index={index} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default ServicesSection
