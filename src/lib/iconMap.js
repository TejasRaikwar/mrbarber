// Maps icon-name strings stored in the database to actual Lucide React components.
// Add entries here as the admin starts using more icon names.
import {
    Layers,
    Repeat,
    Wrench,
    Link,
    Maximize2,
    Scissors,
    Palette,
    Users,
    Award,
    Sparkles,
    Star,
    Heart,
    Crown,
    Brush,
    SprayCan,
    Sparkle,
    HelpCircle
} from "lucide-react"

const ICON_MAP = {
    Layers,
    Repeat,
    Wrench,
    Link,
    Maximize2,
    Scissors,
    Palette,
    Users,
    Award,
    Sparkles,
    Star,
    Heart,
    Crown,
    Brush,
    SprayCan,
    Sparkle
}

export const resolveIcon = (name) => ICON_MAP[name] || HelpCircle
