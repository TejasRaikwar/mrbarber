import { Link } from "react-router-dom"
import { Phone, MapPin, Clock, ChevronDown, ArrowRight } from "lucide-react"
import EnquiryDialog from "@/components/enquiry/EnquiryDialog"
import {
    SITE,
    SERVICES,
    BRANCHES,
    servicePath,
    branchPath,
    branchAddressLine,
    directionsUrl
} from "@/seo/siteSeo"

const telHref = `tel:${SITE.phone.replace(/\s/g, "")}`

/** Dark hero band so the transparent Navbar reads the same as on the home page. */
export const LandingHero = ({ eyebrow, title, intro = [] }) => (
    <section className="relative bg-(--media-bg) pt-36 pb-20 md:pt-44 md:pb-24 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[520px] h-[520px] rounded-full bg-(--brand)/15 blur-3xl pointer-events-none" />
        <div className="relative max-w-5xl mx-auto px-6">
            <nav aria-label="Breadcrumb" className="mb-6 text-sm text-(--media-foreground)/60">
                <Link to="/" className="hover:text-(--brand) transition-colors">Home</Link>
                <span className="mx-2">/</span>
                <span className="text-(--media-foreground)/85">{title}</span>
            </nav>
            <p className="text-(--brand) uppercase tracking-[6px] mb-4 font-semibold text-sm">{eyebrow}</p>
            <h1 className="text-4xl md:text-6xl font-extrabold text-(--media-foreground) leading-tight mb-6 tracking-tight">
                {title}
            </h1>
            {intro.map((p, i) => (
                <p key={i} className="text-base md:text-lg text-(--media-foreground)/80 leading-relaxed mb-4 max-w-3xl font-light">
                    {p}
                </p>
            ))}
            <div className="flex flex-wrap gap-4 mt-8">
                <EnquiryDialog
                    trigger={
                        <button className="cursor-pointer bg-(--brand) hover:bg-(--brand-hover) text-(--brand-foreground) px-7 py-3.5 rounded-lg font-bold transition-all duration-300 hover:-translate-y-0.5">
                            Book a Consultation
                        </button>
                    }
                />
                <a
                    href={telHref}
                    className="inline-flex items-center gap-2 border border-(--media-foreground)/25 hover:border-(--brand) hover:text-(--brand) text-(--media-foreground) px-7 py-3.5 rounded-lg font-bold transition-all duration-300"
                >
                    <Phone className="w-4 h-4" strokeWidth={2.5} />
                    {SITE.phone}
                </a>
            </div>
        </div>
    </section>
)

export const ContentSection = ({ title, children, className = "" }) => (
    <section className={`py-14 ${className}`}>
        <div className="max-w-5xl mx-auto px-6">
            {title && <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8">{title}</h2>}
            {children}
        </div>
    </section>
)

export const FaqList = ({ faqs }) => (
    <div className="space-y-3">
        {faqs.map((f) => (
            <details
                key={f.q}
                className="group bg-card border border-border rounded-2xl px-6 py-5 open:border-(--brand)/30 transition-colors"
            >
                <summary className="flex items-center justify-between gap-4 cursor-pointer list-none font-semibold text-foreground">
                    <h3 className="text-base md:text-lg">{f.q}</h3>
                    <ChevronDown className="w-5 h-5 text-(--brand) shrink-0 transition-transform group-open:rotate-180" />
                </summary>
                <p className="mt-3 text-muted-foreground leading-relaxed">{f.a}</p>
            </details>
        ))}
    </div>
)

export const BranchCards = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {BRANCHES.map((b) => (
            <div key={b.slug} className="bg-card border border-border rounded-3xl p-7 flex flex-col">
                <h3 className="text-xl font-bold text-foreground mb-4">
                    <Link to={branchPath(b)} className="hover:text-(--brand) transition-colors">
                        {b.area}
                    </Link>
                </h3>
                <p className="flex items-start gap-3 text-muted-foreground mb-3">
                    <MapPin className="w-5 h-5 text-(--brand) shrink-0 mt-0.5" strokeWidth={1.75} />
                    <span>{branchAddressLine(b)}</span>
                </p>
                <p className="flex items-center gap-3 text-muted-foreground mb-6">
                    <Clock className="w-5 h-5 text-(--brand) shrink-0" strokeWidth={1.75} />
                    <span>{SITE.hours.label}</span>
                </p>
                <div className="mt-auto flex flex-wrap gap-4 text-sm font-semibold">
                    <a href={directionsUrl(b)} target="_blank" rel="noopener noreferrer" className="text-(--brand) hover:underline">
                        Get directions
                    </a>
                    <Link to={branchPath(b)} className="text-foreground hover:text-(--brand) transition-colors">
                        About this studio →
                    </Link>
                </div>
            </div>
        ))}
    </div>
)

export const ServiceLinks = ({ exclude }) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {SERVICES.filter((s) => s.slug !== exclude).map((s) => (
            <Link
                key={s.slug}
                to={servicePath(s)}
                className="group flex items-center justify-between gap-3 bg-card border border-border hover:border-(--brand)/40 rounded-2xl px-6 py-5 transition-colors"
            >
                <span className="font-semibold text-foreground group-hover:text-(--brand) transition-colors">
                    {s.name} in {SITE.city}
                </span>
                <ArrowRight className="w-4 h-4 text-(--brand) transition-transform group-hover:translate-x-1" />
            </Link>
        ))}
    </div>
)
