import { useState } from "react"
import { Navigate, useNavigate, Link } from "react-router-dom"
import { Scissors, Lock, User, ExternalLink } from "lucide-react"
import { useAuth } from "@/context/AuthContext"

const AdminLogin = () => {
    const { user, login } = useAuth()
    const navigate = useNavigate()
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState(null)
    const [submitting, setSubmitting] = useState(false)

    if (user) return <Navigate to={user.role === "STAFF" ? "/staff" : "/admin"} replace />

    const onSubmit = async (e) => {
        e.preventDefault()
        setError(null)
        setSubmitting(true)
        try {
            const res = await login(username, password)
            navigate(res.role === "STAFF" ? "/staff" : "/admin", { replace: true })
        } catch (err) {
            setError(err.message || "Login failed")
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-6 py-12 transition-colors duration-300 relative">
            {/* Soft brand wash so the white canvas still feels warm */}
            <div
                className="absolute inset-0 -z-10 pointer-events-none"
                style={{
                    background:
                        "radial-gradient(ellipse at 50% 0%, color-mix(in srgb, var(--accent) 65%, transparent), transparent 60%)"
                }}
            />

            <div className="w-full max-w-md bg-card/90 border border-border rounded-3xl p-8 shadow-xl backdrop-blur-md">
                <div className="flex items-center gap-2 mb-6">
                    <Scissors className="text-(--brand)" />
                    <h1 className="text-2xl font-bold tracking-wide">Mr Barber · Portal</h1>
                </div>

                <p className="text-muted-foreground text-sm mb-8">Sign in to continue.</p>

                <form onSubmit={onSubmit} className="space-y-5">
                    <div>
                        <label className="block text-xs uppercase tracking-[2px] text-muted-foreground mb-2">Username</label>
                        <div className="flex items-center gap-2 bg-background border border-border rounded-lg px-3 py-2.5 focus-within:border-(--brand)/60 transition-colors">
                            <User className="w-4 h-4 text-(--brand)" />
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="bg-transparent outline-none flex-1 text-foreground placeholder-muted-foreground"
                                autoComplete="username"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs uppercase tracking-[2px] text-muted-foreground mb-2">Password</label>
                        <div className="flex items-center gap-2 bg-background border border-border rounded-lg px-3 py-2.5 focus-within:border-(--brand)/60 transition-colors">
                            <Lock className="w-4 h-4 text-(--brand)" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="bg-transparent outline-none flex-1 text-foreground placeholder-muted-foreground"
                                autoComplete="current-password"
                                required
                            />
                        </div>
                    </div>

                    {error && (
                        <p className="text-destructive text-sm font-medium">{error}</p>
                    )}

                    <button
                        type="submit"
                        disabled={submitting}
                        className="w-full bg-(--brand) hover:bg-(--brand-hover) disabled:opacity-60 text-(--brand-foreground) font-bold py-3 rounded-lg transition-all"
                    >
                        {submitting ? "Signing in…" : "Sign in"}
                    </button>
                </form>

                <div className="mt-6 pt-5 border-t border-border text-center">
                    <Link to="/"
                        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-(--brand) transition-colors">
                        <ExternalLink className="w-3.5 h-3.5" />
                        View main website
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default AdminLogin
