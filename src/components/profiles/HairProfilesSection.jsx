import HairProfileCard from "./HairProfileCard"
import { hairProfiles } from "./profiles"

const HairProfilesSection = () => {
    return (
        <section id="profiles" className="bg-black pt-12 pb-24 scroll-mt-20">
            <div className="max-w-7xl mx-auto px-6">
                {/* Heading */}
                <div className="text-center mb-14">
                    <p className="text-yellow-500 uppercase tracking-[5px] mb-4">
                        Hair Profiles
                    </p>

                    <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
                        Application for Different Hair Profiles
                    </h2>

                    <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                        Tailored solutions for every concern — from crown thinning
                        to receding temples, see how each profile transforms.
                    </p>
                </div>

                {/* Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {hairProfiles.map((item, index) => (
                        <HairProfileCard
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

export default HairProfilesSection
