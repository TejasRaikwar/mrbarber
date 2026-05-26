import { useEffect, useState } from "react"
import { Scissors } from "lucide-react"
import Navlinks from "./Navlinks.jsx"
import MobileMenu from "./MobileMenu"

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false)

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 40)
        onScroll()
        window.addEventListener("scroll", onScroll, { passive: true })
        return () => window.removeEventListener("scroll", onScroll)
    }, [])

    return (
        <header
            className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
                scrolled
                    ? "bg-black/70 backdrop-blur-lg border-b border-white/10"
                    : "bg-transparent border-b border-transparent"
            }`}
        >
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">

                {/* Logo */}
                <div className="flex items-center gap-2">
                    <Scissors className="text-yellow-500" />

                    <h1 className="text-2xl font-bold text-white tracking-wide">
                        MR BARBER
                    </h1>
                </div>

                {/* Desktop Links */}
                <Navlinks />

                {/* CTA */}
                <button className="hidden cursor-pointer md:block bg-yellow-500 hover:bg-yellow-600 text-black px-5 py-2 rounded-lg font-medium transition-all duration-300">
                    Book Now
                </button>

                {/* Mobile Menu */}
                <MobileMenu />
            </div>
        </header>
    )
}

export default Navbar
