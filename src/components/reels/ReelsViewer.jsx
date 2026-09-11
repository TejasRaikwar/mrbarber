import { useCallback, useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { X, ChevronUp, ChevronDown, Play, Pause, Volume2, VolumeX } from "lucide-react"
import { reelPosterUrl } from "@/lib/media"

/**
 * Immersive shorts-style viewer.
 *
 * Replaces the browser's native fullscreen video UI: reels are swiped
 * vertically with scroll-snap (native-feeling on touch), only the reel in view
 * plays, and playback controls are our own overlay rather than the OS player
 * chrome. Rendered in a portal so it escapes any section stacking context.
 */
const ReelsViewer = ({ reels, startIndex = 0, onClose }) => {
    const trackRef = useRef(null)
    const slideRefs = useRef([])
    const videoRefs = useRef([])

    const [activeIndex, setActiveIndex] = useState(startIndex)
    const [muted, setMuted] = useState(true)
    const [playing, setPlaying] = useState(true)
    const [progress, setProgress] = useState(0)

    const goTo = useCallback((index) => {
        const clamped = Math.max(0, Math.min(index, reels.length - 1))
        slideRefs.current[clamped]?.scrollIntoView({ behavior: "smooth", block: "center" })
    }, [reels.length])

    const togglePlay = useCallback(() => {
        const video = videoRefs.current[activeIndex]
        if (!video) return
        if (video.paused) {
            video.play().catch(() => setPlaying(false))
        } else {
            video.pause()
        }
    }, [activeIndex])

    // Jump to the reel that was clicked, before the first paint of the track.
    useEffect(() => {
        slideRefs.current[startIndex]?.scrollIntoView({ block: "center" })
    }, [startIndex])

    // Lock the page behind the viewer.
    useEffect(() => {
        const previous = document.body.style.overflow
        document.body.style.overflow = "hidden"
        return () => { document.body.style.overflow = previous }
    }, [])

    // Track which reel is on screen as the user swipes.
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return
                    const index = slideRefs.current.indexOf(entry.target)
                    if (index === -1) return
                    setActiveIndex(index)
                    setProgress(0)
                })
            },
            { root: trackRef.current, threshold: 0.6 }
        )

        slideRefs.current.forEach((slide) => slide && observer.observe(slide))
        return () => observer.disconnect()
    }, [reels.length])

    // Only the active reel plays; the rest rewind so they restart when revisited.
    useEffect(() => {
        videoRefs.current.forEach((video, index) => {
            if (!video) return
            if (index === activeIndex) {
                video.play().then(() => setPlaying(true)).catch(() => setPlaying(false))
            } else {
                video.pause()
                video.currentTime = 0
            }
        })
    }, [activeIndex])

    useEffect(() => {
        const onKeyDown = (e) => {
            switch (e.key) {
                case "Escape": onClose(); break
                case "ArrowDown": case "j": e.preventDefault(); goTo(activeIndex + 1); break
                case "ArrowUp": case "k": e.preventDefault(); goTo(activeIndex - 1); break
                case " ": e.preventDefault(); togglePlay(); break
                case "m": setMuted((m) => !m); break
                default: break
            }
        }
        window.addEventListener("keydown", onKeyDown)
        return () => window.removeEventListener("keydown", onKeyDown)
    }, [activeIndex, goTo, onClose, togglePlay])

    const seek = (e) => {
        const video = videoRefs.current[activeIndex]
        if (!video?.duration) return
        const bar = e.currentTarget.getBoundingClientRect()
        const ratio = Math.min(Math.max((e.clientX - bar.left) / bar.width, 0), 1)
        video.currentTime = ratio * video.duration
        setProgress(ratio * 100)
    }

    const active = reels[activeIndex]

    return createPortal(
        <div
            className="fixed inset-0 z-[9999] bg-(--media-bg)"
            role="dialog"
            aria-modal="true"
            aria-label="Reels"
        >
            {/* Ambient wash of the current reel behind the player */}
            <div
                key={active?.id}
                className="absolute inset-0 opacity-25 blur-3xl scale-110 pointer-events-none transition-opacity duration-700"
                style={{
                    backgroundImage: `url(${reelPosterUrl(active?.videoUrl) || ""})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center"
                }}
            />

            {/* Top bar */}
            <div className="absolute top-0 inset-x-0 z-20 flex items-center justify-between p-4 sm:p-6 bg-gradient-to-b from-black/70 to-transparent">
                <span className="text-white/80 text-sm font-medium tabular-nums">
                    {activeIndex + 1} / {reels.length}
                </span>
                <button
                    type="button"
                    onClick={onClose}
                    aria-label="Close reels"
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white backdrop-blur-md transition-colors cursor-pointer"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>

            {/* Vertical reel track */}
            <div ref={trackRef} className="reels-viewer__track">
                {reels.map((reel, index) => (
                    <div
                        key={reel.id}
                        ref={(el) => { slideRefs.current[index] = el }}
                        className="reels-viewer__slide flex items-center justify-center px-4 sm:px-6 pt-16 pb-24"
                    >
                        <div className="relative h-full max-h-[86vh] aspect-[9/16] max-w-full rounded-2xl overflow-hidden bg-black shadow-2xl">
                            <video
                                ref={(el) => { videoRefs.current[index] = el }}
                                src={reel.videoUrl}
                                poster={reelPosterUrl(reel.videoUrl) || undefined}
                                className="h-full w-full object-cover"
                                muted={muted}
                                loop
                                playsInline
                                preload={Math.abs(index - activeIndex) <= 1 ? "auto" : "none"}
                                onClick={togglePlay}
                                onPlay={() => index === activeIndex && setPlaying(true)}
                                onPause={() => index === activeIndex && setPlaying(false)}
                                onTimeUpdate={(e) => {
                                    if (index !== activeIndex) return
                                    const { currentTime, duration } = e.currentTarget
                                    if (duration) setProgress((currentTime / duration) * 100)
                                }}
                            />

                            {/* Paused state — a soft glyph rather than player chrome */}
                            {index === activeIndex && !playing && (
                                <button
                                    type="button"
                                    onClick={togglePlay}
                                    aria-label="Play"
                                    className="absolute inset-0 flex items-center justify-center bg-black/25 cursor-pointer"
                                >
                                    <span className="flex items-center justify-center w-20 h-20 rounded-full bg-white/15 backdrop-blur-md border border-white/30 text-white">
                                        <Play className="w-8 h-8 ml-1" fill="currentColor" />
                                    </span>
                                </button>
                            )}

                            {/* Caption */}
                            <div className="absolute bottom-0 inset-x-0 p-5 pb-7 bg-gradient-to-t from-black/85 to-transparent pointer-events-none">
                                <h3 className="text-white font-semibold text-lg leading-snug drop-shadow-md">
                                    {reel.title}
                                </h3>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Bottom controls for the active reel */}
            <div className="absolute bottom-0 inset-x-0 z-20 px-4 sm:px-6 pb-5 pt-8 bg-gradient-to-t from-black/70 to-transparent">
                <div className="max-w-md mx-auto flex items-center gap-3">
                    <button
                        type="button"
                        onClick={togglePlay}
                        aria-label={playing ? "Pause" : "Play"}
                        className="flex items-center justify-center w-9 h-9 shrink-0 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white backdrop-blur-md transition-colors cursor-pointer"
                    >
                        {playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                    </button>

                    {/* Scrubber */}
                    <div
                        onClick={seek}
                        role="presentation"
                        className="group flex-1 py-3 cursor-pointer"
                    >
                        <div className="relative h-1 rounded-full bg-white/25 overflow-visible">
                            <div
                                className="absolute inset-y-0 left-0 rounded-full bg-(--brand)"
                                style={{ width: `${progress}%` }}
                            />
                            <span
                                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-white opacity-0 group-hover:opacity-100 transition-opacity shadow"
                                style={{ left: `${progress}%` }}
                            />
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() => setMuted((m) => !m)}
                        aria-label={muted ? "Unmute" : "Mute"}
                        className="flex items-center justify-center w-9 h-9 shrink-0 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white backdrop-blur-md transition-colors cursor-pointer"
                    >
                        {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </button>
                </div>
            </div>

            {/* Desktop up/down navigation */}
            {reels.length > 1 && (
                <div className="hidden md:flex flex-col gap-3 absolute right-6 top-1/2 -translate-y-1/2 z-20">
                    <button
                        type="button"
                        onClick={() => goTo(activeIndex - 1)}
                        disabled={activeIndex === 0}
                        aria-label="Previous reel"
                        className="flex items-center justify-center w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white backdrop-blur-md transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                    >
                        <ChevronUp className="w-5 h-5" />
                    </button>
                    <button
                        type="button"
                        onClick={() => goTo(activeIndex + 1)}
                        disabled={activeIndex === reels.length - 1}
                        aria-label="Next reel"
                        className="flex items-center justify-center w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white backdrop-blur-md transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                    >
                        <ChevronDown className="w-5 h-5" />
                    </button>
                </div>
            )}
        </div>,
        document.body
    )
}

export default ReelsViewer
