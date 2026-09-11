const CLOUDINARY_VIDEO_SEGMENT = "/video/upload/"

/**
 * Reels are uploaded to Cloudinary as videos, and Cloudinary can deliver a
 * still frame from the same asset by inserting a transformation and swapping
 * the extension. That gives the rail real poster images instead of making the
 * browser download video metadata for every card.
 *
 * Returns null for anything that isn't a Cloudinary video URL, in which case
 * callers fall back to the video element's own first frame.
 */
export const reelPosterUrl = (videoUrl, { width = 540, height = 960 } = {}) => {
    if (!videoUrl) return null

    const at = videoUrl.indexOf(CLOUDINARY_VIDEO_SEGMENT)
    if (at === -1) return null

    const head = videoUrl.slice(0, at)
    const path = videoUrl.slice(at + CLOUDINARY_VIDEO_SEGMENT.length)
    const transform = `so_0,w_${width},h_${height},c_fill,q_auto,f_jpg`
    const still = path.replace(/\.[a-z0-9]+$/i, ".jpg")

    return `${head}${CLOUDINARY_VIDEO_SEGMENT}${transform}/${still}`
}

/**
 * Media fragment that nudges browsers into painting the first frame when no
 * poster image is available.
 */
export const firstFrameSrc = (videoUrl) =>
    videoUrl && !videoUrl.includes("#") ? `${videoUrl}#t=0.1` : videoUrl

/** mm:ss for a duration in seconds; empty until the metadata has loaded. */
export const formatDuration = (seconds) => {
    if (!Number.isFinite(seconds) || seconds <= 0) return ""
    const total = Math.round(seconds)
    const mins = Math.floor(total / 60)
    const secs = total % 60
    return `${mins}:${String(secs).padStart(2, "0")}`
}
