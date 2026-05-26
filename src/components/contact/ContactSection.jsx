import LocationCard from "./LocationCard"
import { locations } from "./locations"

const ContactSection = () => {
    return (
        <section id="contact" className="bg-black py-16 relative overflow-hidden scroll-mt-20">
            {/* Ambient glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-yellow-500/4 rounded-full blur-3xl pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 relative">
                {/* Heading */}
                <div className="text-center mb-10">
                    <p className="text-yellow-500 uppercase tracking-[5px] mb-3 text-sm">
                        Get In Touch
                    </p>

                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
                        Visit Our Studio
                    </h2>

                    <p className="text-gray-400 max-w-2xl mx-auto">
                        Drop by for a consultation or book a home trial — our experts
                        are ready to craft the right look for you.
                    </p>
                </div>

                {/* Locations */}
                <div className="space-y-8">
                    {locations.map((item, index) => (
                        <LocationCard
                            key={item.id}
                            item={item}
                            index={index}
                        />
                    ))}
                </div>
            </div>
        </section>
    )
}

export default ContactSection
