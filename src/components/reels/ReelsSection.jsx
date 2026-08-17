import { useRef } from "react"
import { useSiteContent } from "@/context/SiteContentContext"
import SectionHeading from "@/components/ui/SectionHeading"
import { Play, Pause, Volume2, VolumeX } from "lucide-react"

const ReelsSection = () => {
    const { reels } = useSiteContent()
    
    if (!reels || reels.length === 0) return null

    return (
        <section className="py-16 bg-black border-t border-white/5 overflow-hidden">
            <div className="max-w-7xl mx-auto px-6">
                <SectionHeading
                    eyebrow="Our Craft in Motion"
                    title="Latest Reels"
                    description="Watch our master barbers at work and get inspired for your next look."
                />

                <div className="mt-12 overflow-x-auto pb-8 snap-x snap-mandatory hide-scrollbar">
                    <div className="flex gap-6 w-max px-4 mx-auto">
                        {reels.map((reel) => (
                            <ReelCard key={reel.id} reel={reel} />
                        ))}
                    </div>
                </div>
            </div>
            <style>{`
                .hide-scrollbar::-webkit-scrollbar { display: none; }
                .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
        </section>
    )
}

const ReelCard = ({ reel }) => {
    const videoRef = useRef(null)
    // Removed complex custom play/mute controls in favor of native controls to ensure best cross-browser mobile experience and reliability.

    return (
        <div className="relative group rounded-2xl overflow-hidden bg-zinc-950 border border-white/10 snap-center w-[280px] sm:w-[320px] aspect-[9/16] shadow-2xl flex-shrink-0">
            <video
                ref={videoRef}
                src={reel.videoUrl}
                className="w-full h-full object-cover"
                loop
                playsInline
                controls
                preload="metadata"
            />
            
            <div className="absolute top-0 left-0 w-full p-4 bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
                <h3 className="text-white font-medium text-lg drop-shadow-md line-clamp-2">
                    {reel.title}
                </h3>
            </div>
        </div>
    )
}

export default ReelsSection
