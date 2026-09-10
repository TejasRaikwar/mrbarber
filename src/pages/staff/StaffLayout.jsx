import { NavLink, Outlet } from "react-router-dom"
import { Scissors, CalendarDays, MessageSquare, LogOut, KeyRound, ExternalLink } from "lucide-react"
import { useAuth } from "@/context/AuthContext"

const NAV = [
    { to: "/staff", label: "Appointments", icon: CalendarDays, end: true },
    { to: "/staff/enquiries", label: "Enquiries", icon: MessageSquare },
    { to: "/staff/change-password", label: "Change Password", icon: KeyRound },
]

const StaffLayout = () => {
    const { user, logout } = useAuth()

    return (
        <div className="min-h-screen bg-background text-foreground flex">
            <aside className="w-60 shrink-0 bg-muted border-r border-border flex flex-col">
                <div className="px-6 py-5 border-b border-border flex items-center gap-2">
                    <Scissors className="text-(--brand)" />
                    <span className="font-bold tracking-wide">Staff Portal</span>
                </div>

                <nav className="flex-1 p-3 space-y-1">
                    {NAV.map(({ to, label, icon: Icon, end }) => (
                        <NavLink key={to} to={to} end={end}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                                    isActive
                                        ? "bg-(--brand) text-(--brand-foreground) font-semibold"
                                        : "text-muted-foreground hover:text-foreground hover:bg-accent/70"
                                }`
                            }>
                            <Icon className="w-4 h-4" />
                            {label}
                        </NavLink>
                    ))}
                </nav>

                <div className="p-3 border-t border-border">
                    <div className="px-3 py-2 text-xs text-muted-foreground">
                        Signed in as <span className="text-foreground">{user?.username}</span>
                    </div>
                    <NavLink to="/"
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-accent/70 transition-colors">
                        <ExternalLink className="w-4 h-4" /> View Website
                    </NavLink>
                    <button onClick={logout}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-accent/70 transition-colors">
                        <LogOut className="w-4 h-4" /> Sign out
                    </button>
                </div>
            </aside>

            <main className="flex-1 overflow-y-auto">
                <div className="max-w-5xl mx-auto px-8 py-10">
                    <Outlet />
                </div>
            </main>
        </div>
    )
}

export default StaffLayout
