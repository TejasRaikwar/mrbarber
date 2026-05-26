import { Scissors, Mail, Phone, MapPin } from "lucide-react"
import { navLinks } from "@/components/Navbar/navLinks"
import { useSectionNav } from "@/components/Navbar/useSectionNav"
import { Instagram, Facebook, Youtube } from "@/components/ui/icons"

const services = [
    "Hair Patch",
    "Hair Replacement",
    "Hair Fixing",
    "Hair Bonding",
    "Hair Extension",
    "Hair Styling",
    "Hair Color"
]

const socials = [
    { Icon: Instagram, href: "https://instagram.com", label: "Instagram" },
    { Icon: Facebook, href: "https://facebook.com", label: "Facebook" },
    { Icon: Youtube, href: "https://youtube.com", label: "YouTube" }
]


const Footer = () => {
    const { handleNavClick } = useSectionNav()

    return (
        <footer className="bg-black border-t border-white/10 relative overflow-hidden">
            {/* Ambient glow */}
            <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-150 h-60 bg-yellow-500/4 rounded-full blur-3xl pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 pt-16 pb-8 relative">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-14">
                    {/* Brand */}
                    <div className="lg:col-span-1">
                        <div className="flex items-center gap-2 mb-5">
                            <Scissors className="text-yellow-500 w-6 h-6" />
                            <h2 className="text-2xl font-bold text-white tracking-wide">
                                MR BARBER
                            </h2>
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed font-light mb-6">
                            Premium hair systems and expert styling — crafted with
                            precision, designed around you.
                        </p>
                        <div className="flex items-center gap-3">
                            {socials.map(({ Icon, href, label }) => (
                                <a
                                    key={label}
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={label}
                                    className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:text-black hover:bg-yellow-500 hover:border-yellow-500 transition-all duration-300"
                                >
                                    <Icon className="w-4 h-4" strokeWidth={1.75} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-yellow-500 uppercase tracking-[3px] text-xs font-semibold mb-5">
                            Quick Links
                        </h3>
                        <ul className="space-y-3">
                            {navLinks.map((link) => (
                                <li key={link.label}>
                                    <a
                                        href={`/${link.hash ? `#${link.hash}` : ""}`}
                                        onClick={(e) => handleNavClick(e, link.hash)}
                                        className="text-gray-400 hover:text-yellow-500 text-sm transition-colors cursor-pointer"
                                    >
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Services */}
                    <div>
                        <h3 className="text-yellow-500 uppercase tracking-[3px] text-xs font-semibold mb-5">
                            Services
                        </h3>
                        <ul className="space-y-3">
                            {services.map((service) => (
                                <li key={service}>
                                    <a
                                        href="/#services"
                                        onClick={(e) => handleNavClick(e, "services")}
                                        className="text-gray-400 hover:text-yellow-500 text-sm transition-colors cursor-pointer"
                                    >
                                        {service}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-yellow-500 uppercase tracking-[3px] text-xs font-semibold mb-5">
                            Reach Us
                        </h3>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3 text-sm text-gray-400">
                                <MapPin className="w-4 h-4 text-yellow-500 shrink-0 mt-0.5" strokeWidth={1.75} />
                                <span className="font-light leading-relaxed">
                                    A-2/40, Shop No. 15, Main Market,
                                    Rajouri Garden, New Delhi — 110027
                                </span>
                            </li>
                            <li className="flex items-center gap-3 text-sm">
                                <Phone className="w-4 h-4 text-yellow-500 shrink-0" strokeWidth={2} />
                                <a
                                    href="tel:+918700797103"
                                    className="text-gray-400 hover:text-yellow-500 transition-colors"
                                >
                                    +91 8700797103
                                </a>
                            </li>
                            <li className="flex items-center gap-3 text-sm">
                                <Mail className="w-4 h-4 text-yellow-500 shrink-0" strokeWidth={2} />
                                <a
                                    href="mailto:hello@mrbarber.com"
                                    className="text-gray-400 hover:text-yellow-500 transition-colors"
                                >
                                    hello@mrbarber.com
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-14 pt-6 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-gray-500 text-xs">
                        &copy; {new Date().getFullYear()} Mr Barber. All rights reserved.
                    </p>
                    <div className="flex items-center gap-6 text-xs text-gray-500">
                        <a href="#" className="hover:text-yellow-500 transition-colors">
                            Privacy Policy
                        </a>
                        <a href="#" className="hover:text-yellow-500 transition-colors">
                            Terms of Service
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer
