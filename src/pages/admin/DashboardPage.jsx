import { useEffect, useState } from "react"
import { TrendingUp, CalendarDays, MessageSquare, IndianRupee, Users, Wallet } from "lucide-react"
import { api } from "@/api/client"
import { PageHeader } from "./components/FormFields"

const fmt = (val) => val != null ? `₹${Number(val).toLocaleString("en-IN")}` : "₹0"

const StatCard = ({ label, value, icon: Icon, accent = false, danger = false }) => {
    const tone =
        danger
            ? { border: "border-red-500/30", iconBg: "bg-red-500/15", icon: "text-red-400", value: "text-red-400" }
            : accent
            ? { border: "border-yellow-500/30", iconBg: "bg-yellow-500/15", icon: "text-yellow-500", value: "text-yellow-400" }
            : { border: "border-white/10", iconBg: "bg-white/5", icon: "text-gray-400", value: "text-white" }
    return (
        <div className={`bg-zinc-900/60 border ${tone.border} rounded-2xl p-6 flex items-start gap-4`}>
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${tone.iconBg}`}>
                <Icon className={`w-5 h-5 ${tone.icon}`} />
            </div>
            <div>
                <p className="text-xs uppercase tracking-[2px] text-gray-500 mb-1">{label}</p>
                <p className={`text-2xl font-bold ${tone.value}`}>{value}</p>
            </div>
        </div>
    )
}

const DashboardPage = () => {
    const [stats, setStats] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        api.getDashboardStats().then(setStats).finally(() => setLoading(false))
    }, [])

    return (
        <>
            <PageHeader title="Dashboard" description="Overview of income, expenses and activity." />

            {loading ? (
                <p className="text-gray-500 text-sm">Loading…</p>
            ) : (
                <div className="space-y-8">
                    {/* Income */}
                    <div>
                        <p className="text-xs uppercase tracking-[2px] text-gray-500 mb-4">Income</p>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            <StatCard label="Today" value={fmt(stats?.dailyIncome)} icon={IndianRupee} accent />
                            <StatCard label="This Month" value={fmt(stats?.monthlyIncome)} icon={IndianRupee} accent />
                            <StatCard label="This Quarter" value={fmt(stats?.quarterlyIncome)} icon={IndianRupee} accent />
                            <StatCard label="This Year" value={fmt(stats?.annualIncome)} icon={TrendingUp} accent />
                        </div>
                    </div>

                    {/* Expenses */}
                    <div>
                        <p className="text-xs uppercase tracking-[2px] text-gray-500 mb-4">Expenses</p>
                        <div className="grid grid-cols-2 gap-4">
                            <StatCard label="Employee Spending (Monthly)"
                                value={fmt(stats?.employeeSpending)} icon={Wallet} danger />
                            <StatCard label="Total Staff" value={stats?.totalStaff ?? 0} icon={Users} />
                        </div>
                    </div>

                    {/* Activity */}
                    <div>
                        <p className="text-xs uppercase tracking-[2px] text-gray-500 mb-4">Activity</p>
                        <div className="grid grid-cols-2 gap-4">
                            <StatCard label="Total Appointments" value={stats?.totalAppointments ?? 0} icon={CalendarDays} />
                            <StatCard label="Total Enquiries" value={stats?.totalEnquiries ?? 0} icon={MessageSquare} />
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default DashboardPage
