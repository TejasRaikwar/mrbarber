import { useEffect, useRef, useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useSiteContent } from "@/context/SiteContentContext"
import SectionHeading from "@/components/ui/SectionHeading"
import ReelCard from "./ReelCard"
import ReelsViewer from "./ReelsViewer"
import "./reels.css"

const ReelsSection = () => {
    const { reels } = useSiteContent()
    const railRef = useRef(null)
    const [openAt, setOpenAt] = useState(null)
    const [edges, setEdges] = useState({ start: true, end: false })

    // Only show a rail arrow when there is actually something that way.
    useEffect(() => {
        const rail = railRef.current
        if (!rail) return

        const sync = () => {
            const { scrollLeft, scrollWidth, clientWidth } = rail
            setEdges({
                start: scrollLeft <= 8,
                end: scrollLeft + clientWidth >= scrollWidth - 8
            })
        }

        sync()
        rail.addEventListener("scroll", sync, { passive: true })
        window.addEventListener("resize", sync)
        return () => {
            rail.removeEventListener("scroll", sync)
            window.removeEventListener("resize", sync)
        }
    }, [reels])

    if (!reels || reels.length === 0) return null

    const scrollBy = (direction) => {
        const rail = railRef.current
        if (!rail) return
        rail.scrollBy({ left: direction * (rail.clientWidth * 0.8), behavior: "smooth" })
    }

    return (
        <section id="reels" className="py-20 bg-muted/40 border-y border-border overflow-hidden">
            <div className="max-w-7xl mx-auto">
                <div className="px-6">
                    <SectionHeading
                        eyebrow="Our Craft in Motion"
                        title="Latest Reels"
                        description="Watch our master barbers at work and get inspired for your next look."
                    />
                </div>

                <div className="relative mt-10">
                    {/* Edge fades so the rail reads as continuing off-screen */}
                    <div className="hidden sm:block absolute left-0 inset-y-0 w-16 z-10 bg-linear-to-r from-muted to-transparent pointer-events-none" />
                    <div className="hidden sm:block absolute right-0 inset-y-0 w-16 z-10 bg-linear-to-l from-muted to-transparent pointer-events-none" />

                    <div ref={railRef} className="reels-rail">
                        {reels.map((reel, index) => (
                            <div key={reel.id} className="reels-rail__item">
                                <ReelCard reel={reel} onOpen={() => setOpenAt(index)} />
                            </div>
                        ))}
                    </div>

                    {reels.length > 1 && (
                        <>
                            <button
                                type="button"
                                onClick={() => scrollBy(-1)}
                                disabled={edges.start}
                                aria-label="Previous reels"
                                className="hidden md:flex absolute left-3 top-1/2 -translate-y-1/2 z-20 items-center justify-center w-11 h-11 rounded-full bg-background/90 hover:bg-(--brand) hover:text-(--brand-foreground) border border-border text-foreground shadow-md backdrop-blur-md transition-all disabled:opacity-0 disabled:pointer-events-none cursor-pointer"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <button
                                type="button"
                                onClick={() => scrollBy(1)}
                                disabled={edges.end}
                                aria-label="More reels"
                                className="hidden md:flex absolute right-3 top-1/2 -translate-y-1/2 z-20 items-center justify-center w-11 h-11 rounded-full bg-background/90 hover:bg-(--brand) hover:text-(--brand-foreground) border border-border text-foreground shadow-md backdrop-blur-md transition-all disabled:opacity-0 disabled:pointer-events-none cursor-pointer"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </>
                    )}
                </div>
            </div>

            {openAt !== null && (
                <ReelsViewer
                    reels={reels}
                    startIndex={openAt}
                    onClose={() => setOpenAt(null)}
                />
            )}
        </section>
    )
}

export default ReelsSection
