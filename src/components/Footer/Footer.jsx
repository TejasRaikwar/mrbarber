import { Scissors, Mail, Phone, MapPin } from "lucide-react"
import { Link } from "react-router-dom"
import { useSectionNav } from "@/components/Navbar/useSectionNav"
import { useSiteContent } from "@/context/SiteContentContext"
import { Instagram, Facebook, Youtube } from "@/components/ui/icons"

const SOCIAL_ICON_MAP = {
    Instagram,
    Facebook,
    Youtube
}

const Footer = () => {
    const { handleNavClick } = useSectionNav()
    const { settings, navLinks, services, socialLinks } = useSiteContent()

    const siteName = settings?.siteName || "MR BARBER"
    const logoUrl = settings?.logoUrl
    const description =
        settings?.footerDescription ||
        "Premium hair systems and expert styling — crafted with precision, designed around you."
    const address = settings?.footerAddress
    const phone = settings?.footerPhone
    const email = settings?.footerEmail
    const copyright =
        settings?.copyrightText || `© ${new Date().getFullYear()} ${siteName}. All rights reserved.`

    return (
        <footer className="bg-black border-t border-white/10 relative overflow-hidden">
            <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-150 h-60 bg-yellow-500/4 rounded-full blur-3xl pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 pt-16 pb-8 relative">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-14">
                    {/* Brand */}
                    <div className="lg:col-span-1">
                        <div className="flex items-center gap-2 mb-5">
                            {logoUrl ? (
                                <img src={logoUrl} alt={siteName} className="h-7 w-auto object-contain" />
                            ) : (
                                <Scissors className="text-yellow-500 w-6 h-6" />
                            )}
                            <h2 className="text-2xl font-bold text-white tracking-wide">
                                {siteName}
                            </h2>
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed font-light mb-6">
                            {description}
                        </p>
                        <div className="flex items-center gap-3">
                            {(socialLinks || []).map((s) => {
                                const Icon = SOCIAL_ICON_MAP[s.platform]
                                if (!Icon) return null
                                return (
                                    <a
                                        key={s.id ?? s.platform}
                                        href={s.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={s.platform}
                                        className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:text-black hover:bg-yellow-500 hover:border-yellow-500 transition-all duration-300"
                                    >
                                        <Icon className="w-4 h-4" strokeWidth={1.75} />
                                    </a>
                                )
                            })}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-yellow-500 uppercase tracking-[3px] text-xs font-semibold mb-5">
                            Quick Links
                        </h3>
                        <ul className="space-y-3">
                            {(navLinks || []).map((link) => (
                                <li key={link.id ?? link.label}>
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
                            {(services || []).map((s) => (
                                <li key={s.id}>
                                    <a
                                        href="/#services"
                                        onClick={(e) => handleNavClick(e, "services")}
                                        className="text-gray-400 hover:text-yellow-500 text-sm transition-colors cursor-pointer"
                                    >
                                        {s.title}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Reach Us */}
                    <div>
                        <h3 className="text-yellow-500 uppercase tracking-[3px] text-xs font-semibold mb-5">
                            Reach Us
                        </h3>
                        <ul className="space-y-4">
                            {address && (
                                <li className="flex items-start gap-3 text-sm text-gray-400">
                                    <MapPin className="w-4 h-4 text-yellow-500 shrink-0 mt-0.5" strokeWidth={1.75} />
                                    <span className="font-light leading-relaxed">{address}</span>
                                </li>
                            )}
                            {phone && (
                                <li className="flex items-center gap-3 text-sm">
                                    <Phone className="w-4 h-4 text-yellow-500 shrink-0" strokeWidth={2} />
                                    <a
                                        href={`tel:${phone.replace(/\s/g, "")}`}
                                        className="text-gray-400 hover:text-yellow-500 transition-colors"
                                    >
                                        {phone}
                                    </a>
                                </li>
                            )}
                            {email && (
                                <li className="flex items-center gap-3 text-sm">
                                    <Mail className="w-4 h-4 text-yellow-500 shrink-0" strokeWidth={2} />
                                    <a
                                        href={`mailto:${email}`}
                                        className="text-gray-400 hover:text-yellow-500 transition-colors"
                                    >
                                        {email}
                                    </a>
                                </li>
                            )}
                        </ul>
                    </div>
                </div>

                <div className="mt-14 pt-6 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-gray-500 text-xs">{copyright}</p>
                    <div className="flex items-center gap-6 text-xs text-gray-500">
                        <a href="#" className="hover:text-yellow-500 transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-yellow-500 transition-colors">Terms of Service</a>
                        <Link to="/admin/login" className="hover:text-yellow-500 transition-colors">Admin</Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer
