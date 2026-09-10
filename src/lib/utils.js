import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Accepts either a raw Google Maps embed URL or a full <iframe> snippet
// pasted from Google Maps "Share > Embed a map", and returns the URL alone.
export function extractMapEmbedSrc(value) {
  if (!value) return ""
  const match = value.match(/src=["']([^"']+)["']/i)
  return (match ? match[1] : value).trim()
}
