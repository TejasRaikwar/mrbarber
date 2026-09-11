import { useRef, useState } from "react"
import { Play } from "lucide-react"
import { reelPosterUrl, firstFrameSrc, formatDuration } from "@/lib/media"

/**
 * One reel in the rail. Deliberately has no native <video> controls — it is a
 * poster tile that previews on hover and opens the immersive viewer on click,
 * so the section reads as shorts rather than as a row of video players.
 */
const ReelCard = ({ reel, onOpen }) => {
    const videoRef = useRef(null)
    const [duration, setDuration] = useState(0)

    const poster = reelPosterUrl(reel.videoUrl)

    const preview = (play) => {
        const video = videoRef.current
        if (!video) return
        if (play) {
            video.play().catch(() => {
                /* preview is a nicety — ignore autoplay refusals */
            })
        } else {
            video.pause()
            video.currentTime = 0
        }
    }

    return (
        <button
            type="button"
            onClick={onOpen}
            onMouseEnter={() => preview(true)}
            onMouseLeave={() => preview(false)}
            onFocus={() => preview(true)}
            onBlur={() => preview(false)}
            aria-label={`Play reel: ${reel.title}`}
            className="group relative block w-[220px] sm:w-[248px] aspect-[9/16] rounded-3xl overflow-hidden bg-(--media-bg) border border-border shadow-md text-left transition-all duration-500 hover:-translate-y-1.5 hover:shadow-xl hover:border-(--brand)/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--brand) focus-visible:ring-offset-2 focus-visible:ring-offset-background cursor-pointer"
        >
            <video
                ref={videoRef}
                src={poster ? reel.videoUrl : firstFrameSrc(reel.videoUrl)}
                poster={poster || undefined}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
                muted
                loop
                playsInline
                preload="metadata"
                tabIndex={-1}
            />

            {/* Legibility scrim — kept dark in every theme, it sits on footage */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-black/30 pointer-events-none" />

            {/* Play affordance */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="flex items-center justify-center w-14 h-14 rounded-full bg-white/15 backdrop-blur-md border border-white/30 text-white transition-all duration-500 group-hover:scale-110 group-hover:bg-(--brand) group-hover:border-(--brand) group-hover:text-(--brand-foreground)">
                    <Play className="w-5 h-5 ml-0.5" fill="currentColor" />
                </span>
            </div>

            {duration > 0 && (
                <span className="absolute top-3 right-3 rounded-full bg-black/60 backdrop-blur-md px-2.5 py-1 text-[11px] font-semibold text-white tabular-nums pointer-events-none">
                    {formatDuration(duration)}
                </span>
            )}

            <h3 className="absolute bottom-0 left-0 right-0 p-4 text-white font-semibold text-[15px] leading-snug line-clamp-2 drop-shadow-md pointer-events-none">
                {reel.title}
            </h3>
        </button>
    )
}

export default ReelCard
