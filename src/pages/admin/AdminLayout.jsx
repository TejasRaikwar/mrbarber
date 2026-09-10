import { useState, useEffect } from "react"
import { NavLink, Outlet, useLocation } from "react-router-dom"
import {
    Scissors,
    LayoutDashboard,
    UserPlus,
    CalendarDays,
    MessageSquare,
    Users,
    Settings,
    LayoutGrid,
    Image as ImageIcon,
    MapPin,
    Type,
    Star,
    LogOut,
    ExternalLink,
    KeyRound,
    ChevronLeft,
    ChevronRight,
    Film
} from "lucide-react"
import { useAuth } from "@/context/AuthContext"

// Direct top-level links (no sub-menu)
const DIRECT_LINKS = [
    { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
    { to: "/admin/register", label: "Register", icon: UserPlus },
    { to: "/admin/appointments", label: "Appointments", icon: CalendarDays },
    { to: "/admin/enquiries", label: "Enquiries", icon: MessageSquare },
    { to: "/admin/staff", label: "Staff", icon: Users },
]

// Expandable sections
const SECTIONS = [
    {
        id: "site",
        label: "Site Settings",
        icon: Settings,
        description: "Brand, content, logo & more",
        items: [
            { to: "/admin/settings", label: "Site Settings", icon: Settings },
            { to: "/admin/change-password", label: "Change Password", icon: KeyRound },
            { to: "/admin/hero-slides", label: "Hero Slides", icon: LayoutGrid },
            { to: "/admin/reels", label: "Reels", icon: Film },
            { to: "/admin/marquee", label: "Marquee", icon: Type },
            { to: "/admin/services", label: "Services", icon: Scissors },
            { to: "/admin/transformations", label: "Transformations", icon: ImageIcon },
            { to: "/admin/hair-profiles", label: "Hair Profiles", icon: Users },
            { to: "/admin/reviews", label: "Reviews", icon: Star },
            { to: "/admin/locations", label: "Locations", icon: MapPin },
            { to: "/admin/social-links", label: "Social Links", icon: ExternalLink }
        ]
    }
]

const getSectionForPath = (path) => {
    for (const section of SECTIONS) {
        if (section.items.some((item) => path.startsWith(item.to))) {
            return section.id
        }
    }
    return null
}

const AdminLayout = () => {
    const { user, logout } = useAuth()
    const location = useLocation()
    const [activeSection, setActiveSection] = useState(() => getSectionForPath(location.pathname))

    useEffect(() => {
        setActiveSection(getSectionForPath(location.pathname))
    }, [location.pathname])

    const currentSection = SECTIONS.find((s) => s.id === activeSection)

    return (
        <div className="min-h-screen bg-background text-foreground flex">
            {/* Sidebar */}
            <aside className="w-64 shrink-0 bg-sidebar border-r border-border flex flex-col">
                <div className="px-6 py-5 border-b border-border flex items-center gap-2">
                    <Scissors className="text-(--brand)" />
                    <span className="font-bold tracking-wide">Admin</span>
                </div>

                <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
                    {currentSection ? (
                        /* ── Sub-menu ── */
                        <>
                            <button
                                onClick={() => setActiveSection(null)}
                                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-accent/70 transition-colors mb-1"
                            >
                                <ChevronLeft className="w-4 h-4" />
                                Back
                            </button>

                            <div className="px-3 pt-1 pb-2">
                                <p className="text-xs uppercase tracking-[2px] text-(--brand) font-semibold">
                                    {currentSection.label}
                                </p>
                            </div>

                            {currentSection.items.map(({ to, label, icon: Icon }) => (
                                <NavLink
                                    key={to}
                                    to={to}
                                    className={({ isActive }) =>
                                        `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                                            isActive
                                                ? "bg-(--brand) text-(--brand-foreground) font-semibold"
                                                : "text-muted-foreground hover:text-foreground hover:bg-accent/70"
                                        }`
                                    }
                                >
                                    <Icon className="w-4 h-4" />
                                    {label}
                                </NavLink>
                            ))}
                        </>
                    ) : (
                        /* ── Main menu ── */
                        <>
                            {/* Direct links */}
                            {DIRECT_LINKS.map(({ to, label, icon: Icon, end }) => (
                                <NavLink
                                    key={to}
                                    to={to}
                                    end={end}
                                    className={({ isActive }) =>
                                        `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                                            isActive
                                                ? "bg-(--brand) text-(--brand-foreground) font-semibold"
                                                : "text-muted-foreground hover:text-foreground hover:bg-accent/70"
                                        }`
                                    }
                                >
                                    <Icon className="w-4 h-4" />
                                    {label}
                                </NavLink>
                            ))}

                            {/* Divider */}
                            <div className="my-2 border-t border-border/60" />

                            {/* Expandable sections */}
                            {SECTIONS.map(({ id, label, icon: Icon, description }) => (
                                <button
                                    key={id}
                                    onClick={() => setActiveSection(id)}
                                    className="w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm hover:bg-accent/70 transition-colors text-left group"
                                >
                                    <div className="w-8 h-8 rounded-lg bg-accent/60 group-hover:bg-(--brand)/10 flex items-center justify-center shrink-0 transition-colors">
                                        <Icon className="w-4 h-4 text-muted-foreground group-hover:text-(--brand) transition-colors" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-foreground text-sm">{label}</p>
                                        <p className="text-xs text-muted-foreground truncate">{description}</p>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-muted-foreground/70 group-hover:text-muted-foreground transition-colors shrink-0" />
                                </button>
                            ))}
                        </>
                    )}
                </nav>

                <div className="p-3 border-t border-border">
                    <div className="px-3 py-2 text-xs text-muted-foreground">
                        Signed in as <span className="text-foreground">{user?.username}</span>
                    </div>
                    <NavLink to="/"
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-accent/70 transition-colors">
                        <ExternalLink className="w-4 h-4" />
                        View Website
                    </NavLink>
                    <button
                        onClick={logout}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-accent/70 transition-colors"
                    >
                        <LogOut className="w-4 h-4" />
                        Sign out
                    </button>
                </div>
            </aside>

            {/* Content */}
            <main className="flex-1 overflow-y-auto">
                <div className="max-w-5xl mx-auto px-8 py-10">
                    <Outlet />
                </div>
            </main>
        </div>
    )
}

export default AdminLayout
