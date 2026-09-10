import { useSectionNav } from "./useSectionNav"
import { useSiteContent } from "@/context/SiteContentContext"

/** `overHero` = the bar is floating over hero photography, so links go light. */
const Navlinks = ({ overHero = false }) => {
    const { handleNavClick } = useSectionNav()
    const { navLinks } = useSiteContent()

    return (
        <div className="hidden md:flex items-center gap-8">
            {(navLinks || []).map((link) => (
                <a
                    key={link.id ?? link.label}
                    href={`/${link.hash ? `#${link.hash}` : ""}`}
                    onClick={(e) => handleNavClick(e, link.hash)}
                    className={`transition-all duration-300 cursor-pointer ${
                        overHero
                            ? "text-(--media-foreground)/90 hover:text-(--media-foreground) drop-shadow-md"
                            : "text-foreground hover:text-(--brand)"
                    }`}
                >
                    {link.label}
                </a>
            ))}
        </div>
    )
}

export default Navlinks
