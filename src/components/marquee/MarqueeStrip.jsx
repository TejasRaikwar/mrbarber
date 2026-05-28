import { Scissors } from "lucide-react"
import "./marquee-strip.css"
import { useSiteContent } from "@/context/SiteContentContext"

const MarqueeStrip = () => {
    const { marqueeItems } = useSiteContent()
    if (!marqueeItems || marqueeItems.length === 0) return null

    const loop = [...marqueeItems, ...marqueeItems]

    return (
        <div className="relative bg-yellow-500 text-black border-y border-yellow-600/40 overflow-hidden">
            <div className="marquee-strip">
                <div className="marquee-strip__track">
                    {loop.map((item, i) => (
                        <div
                            key={`${item.id}-${i}`}
                            className="marquee-strip__item flex items-center gap-6 text-sm md:text-base font-extrabold uppercase tracking-[5px] whitespace-nowrap"
                        >
                            <span>{item.text}</span>
                            <Scissors className="w-4 h-4 shrink-0" strokeWidth={2.5} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default MarqueeStrip
