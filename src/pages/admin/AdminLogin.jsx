import { useState } from "react"
import { Navigate, useNavigate } from "react-router-dom"
import { Scissors, Lock, User } from "lucide-react"
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
        <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">
            <div className="w-full max-w-md bg-zinc-900/60 border border-white/10 rounded-3xl p-8 shadow-2xl backdrop-blur-md">
                <div className="flex items-center gap-2 mb-6">
                    <Scissors className="text-yellow-500" />
                    <h1 className="text-2xl font-bold tracking-wide">Mr Barber · Portal</h1>
                </div>

                <p className="text-gray-400 text-sm mb-8">Sign in to continue.</p>

                <form onSubmit={onSubmit} className="space-y-5">
                    <div>
                        <label className="block text-xs uppercase tracking-[2px] text-gray-500 mb-2">Username</label>
                        <div className="flex items-center gap-2 bg-black/40 border border-white/10 rounded-lg px-3 py-2.5 focus-within:border-yellow-500/50">
                            <User className="w-4 h-4 text-yellow-500" />
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="bg-transparent outline-none flex-1 text-white"
                                autoComplete="username"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs uppercase tracking-[2px] text-gray-500 mb-2">Password</label>
                        <div className="flex items-center gap-2 bg-black/40 border border-white/10 rounded-lg px-3 py-2.5 focus-within:border-yellow-500/50">
                            <Lock className="w-4 h-4 text-yellow-500" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="bg-transparent outline-none flex-1 text-white"
                                autoComplete="current-password"
                                required
                            />
                        </div>
                    </div>

                    {error && (
                        <p className="text-red-400 text-sm">{error}</p>
                    )}

                    <button
                        type="submit"
                        disabled={submitting}
                        className="w-full bg-yellow-500 hover:bg-yellow-600 disabled:opacity-60 text-black font-bold py-3 rounded-lg transition-all"
                    >
                        {submitting ? "Signing in…" : "Sign in"}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default AdminLogin
