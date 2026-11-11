import { useState } from "react"
import { Navigate, useNavigate, Link } from "react-router-dom"
import { Scissors, Lock, User, ExternalLink, ShieldCheck, ArrowLeft } from "lucide-react"
import { useAuth } from "@/context/AuthContext"

const AdminLogin = () => {
    const { user, requestOtp, verifyOtp } = useAuth()
    const navigate = useNavigate()
    const [step, setStep] = useState("credentials") // "credentials" | "otp"
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [otp, setOtp] = useState("")
    const [maskedEmail, setMaskedEmail] = useState("")
    const [error, setError] = useState(null)
    const [info, setInfo] = useState(null)
    const [submitting, setSubmitting] = useState(false)

    if (user) return <Navigate to={user.role === "STAFF" ? "/staff" : "/admin"} replace />

    const onSubmitCredentials = async (e) => {
        e.preventDefault()
        setError(null)
        setInfo(null)
        setSubmitting(true)
        try {
            const res = await requestOtp(username, password)
            setMaskedEmail(res.maskedEmail || "")
            setOtp("")
            setStep("otp")
        } catch (err) {
            setError(err.message || "Login failed")
        } finally {
            setSubmitting(false)
        }
    }

    const onSubmitOtp = async (e) => {
        e.preventDefault()
        setError(null)
        setInfo(null)
        setSubmitting(true)
        try {
            const res = await verifyOtp(username, otp)
            navigate(res.role === "STAFF" ? "/staff" : "/admin", { replace: true })
        } catch (err) {
            setError(err.message || "Invalid code")
        } finally {
            setSubmitting(false)
        }
    }

    const onResend = async () => {
        setError(null)
        setInfo(null)
        setSubmitting(true)
        try {
            const res = await requestOtp(username, password)
            setMaskedEmail(res.maskedEmail || "")
            setOtp("")
            // A repeat request within the cooldown reuses the still-valid code instead
            // of mailing a new one — say so, rather than implying the old code died.
            setInfo(res.emailSent
                ? "A new code was just sent — any earlier code no longer works."
                : "A code was already sent moments ago — check your inbox for it.")
        } catch (err) {
            setError(err.message || "Could not resend code")
        } finally {
            setSubmitting(false)
        }
    }

    const backToCredentials = () => {
        setStep("credentials")
        setOtp("")
        setInfo(null)
        setError(null)
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

                {step === "credentials" ? (
                    <>
                        <p className="text-muted-foreground text-sm mb-8">Sign in to continue.</p>

                        <form onSubmit={onSubmitCredentials} className="space-y-5">
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
                                {submitting ? "Sending code…" : "Continue"}
                            </button>
                        </form>
                    </>
                ) : (
                    <>
                        <div className="flex items-center gap-2 text-(--brand) mb-2">
                            <ShieldCheck className="w-4 h-4" />
                            <span className="text-xs uppercase tracking-[2px] font-semibold">Verification code</span>
                        </div>
                        <p className="text-muted-foreground text-sm mb-8">
                            We sent a 6-digit code to <span className="text-foreground font-medium">{maskedEmail || "your registered email"}</span>. Enter it below to finish signing in.
                        </p>

                        <form onSubmit={onSubmitOtp} className="space-y-5">
                            <div>
                                <label className="block text-xs uppercase tracking-[2px] text-muted-foreground mb-2">6-digit code</label>
                                <div className="flex items-center gap-2 bg-background border border-border rounded-lg px-3 py-2.5 focus-within:border-(--brand)/60 transition-colors">
                                    <ShieldCheck className="w-4 h-4 text-(--brand)" />
                                    <input
                                        type="text"
                                        inputMode="numeric"
                                        pattern="[0-9]*"
                                        maxLength={6}
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                                        className="bg-transparent outline-none flex-1 text-foreground placeholder-muted-foreground tracking-[6px] font-semibold"
                                        placeholder="••••••"
                                        autoComplete="one-time-code"
                                        autoFocus
                                        required
                                    />
                                </div>
                            </div>

                            {info && (
                                <p className="text-(--brand) text-sm font-medium">{info}</p>
                            )}
                            {error && (
                                <p className="text-destructive text-sm font-medium">{error}</p>
                            )}

                            <button
                                type="submit"
                                disabled={submitting || otp.length !== 6}
                                className="w-full bg-(--brand) hover:bg-(--brand-hover) disabled:opacity-60 text-(--brand-foreground) font-bold py-3 rounded-lg transition-all"
                            >
                                {submitting ? "Verifying…" : "Verify & sign in"}
                            </button>

                            <div className="flex items-center justify-between text-sm">
                                <button
                                    type="button"
                                    onClick={backToCredentials}
                                    className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-(--brand) transition-colors"
                                >
                                    <ArrowLeft className="w-3.5 h-3.5" />
                                    Back
                                </button>
                                <button
                                    type="button"
                                    onClick={onResend}
                                    disabled={submitting}
                                    className="text-muted-foreground hover:text-(--brand) transition-colors disabled:opacity-60"
                                >
                                    Resend code
                                </button>
                            </div>
                        </form>
                    </>
                )}

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
