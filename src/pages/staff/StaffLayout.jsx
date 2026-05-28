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
        <div className="min-h-screen bg-black text-white flex">
            <aside className="w-60 shrink-0 bg-zinc-950 border-r border-white/10 flex flex-col">
                <div className="px-6 py-5 border-b border-white/10 flex items-center gap-2">
                    <Scissors className="text-yellow-500" />
                    <span className="font-bold tracking-wide">Staff Portal</span>
                </div>

                <nav className="flex-1 p-3 space-y-1">
                    {NAV.map(({ to, label, icon: Icon, end }) => (
                        <NavLink key={to} to={to} end={end}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                                    isActive
                                        ? "bg-yellow-500 text-black font-semibold"
                                        : "text-gray-400 hover:text-white hover:bg-white/5"
                                }`
                            }>
                            <Icon className="w-4 h-4" />
                            {label}
                        </NavLink>
                    ))}
                </nav>

                <div className="p-3 border-t border-white/10">
                    <div className="px-3 py-2 text-xs text-gray-500">
                        Signed in as <span className="text-white">{user?.username}</span>
                    </div>
                    <NavLink to="/"
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-colors">
                        <ExternalLink className="w-4 h-4" /> View Website
                    </NavLink>
                    <button onClick={logout}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-colors">
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
