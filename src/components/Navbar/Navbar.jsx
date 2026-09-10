import { useEffect, useState } from "react"
import { Scissors } from "lucide-react"
import Navlinks from "./Navlinks.jsx"
import MobileMenu from "./MobileMenu"
import EnquiryDialog from "@/components/enquiry/EnquiryDialog"
import { useSiteContent } from "@/context/SiteContentContext"

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false)
    const { settings } = useSiteContent()

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 40)
        onScroll()
        window.addEventListener("scroll", onScroll, { passive: true })
        return () => window.removeEventListener("scroll", onScroll)
    }, [])

    const siteName = settings?.siteName || "MR BARBER"
    const [logoError, setLogoError] = useState(false)
    const logoUrl = !logoError && settings?.logoUrl ? settings.logoUrl : null

    // At the top of the page the bar floats over the hero photography, so it
    // uses the light media palette. Once scrolled it gains a solid backdrop
    // and switches to the active theme's colors.
    const overHero = !scrolled

    return (
        <header
            className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
                scrolled
                    ? "bg-background/85 backdrop-blur-lg border-b border-border"
                    : "bg-transparent border-b border-transparent"
            }`}
        >
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">

                {/* Logo */}
                <a href="/" className="flex items-center gap-2">
                    {logoUrl ? (
                        <img
                            src={logoUrl}
                            alt={siteName}
                            className="h-8 w-auto object-contain"
                            onError={() => setLogoError(true)}
                        />
                    ) : (
                        <Scissors
                            className={overHero ? "text-(--media-foreground)" : "text-(--brand)"}
                        />
                    )}
                    <h1
                        className={`text-2xl font-bold tracking-wide transition-colors duration-300 ${
                            overHero
                                ? "text-(--media-foreground) drop-shadow-md"
                                : "text-foreground"
                        }`}
                    >
                        {siteName}
                    </h1>
                </a>

                <Navlinks overHero={overHero} />

                <EnquiryDialog
                    trigger={
                        <button
                            className={`hidden cursor-pointer md:block px-5 py-2 rounded-lg font-medium transition-all duration-300 ${
                                overHero
                                    ? "bg-(--media-foreground) text-(--media-bg) hover:bg-(--brand) hover:text-(--brand-foreground)"
                                    : "bg-(--brand) hover:bg-(--brand-hover) text-(--brand-foreground)"
                            }`}
                        >
                            Enquire Now
                        </button>
                    }
                />

                <MobileMenu overHero={overHero} />
            </div>
        </header>
    )
}

export default Navbar
