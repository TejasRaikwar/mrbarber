import { navLinks } from "./navLinks"
import { useSectionNav } from "./useSectionNav"

const Navlinks = () => {
    const { handleNavClick } = useSectionNav()

    return (
        <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
                <a
                    key={link.label}
                    href={`/${link.hash ? `#${link.hash}` : ""}`}
                    onClick={(e) => handleNavClick(e, link.hash)}
                    className="text-white hover:text-yellow-500 transition-all duration-300 cursor-pointer"
                >
                    {link.label}
                </a>
            ))}
        </div>
    )
}

export default Navlinks
