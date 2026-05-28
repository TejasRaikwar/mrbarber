import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { api } from "@/api/client"
import { useAuth } from "@/context/AuthContext"
import { TextField, Button, PageHeader } from "./components/FormFields"

const ChangePasswordPage = () => {
    const { logout } = useAuth()
    const navigate = useNavigate()

    const [current, setCurrent] = useState("")
    const [next, setNext] = useState("")
    const [confirm, setConfirm] = useState("")
    const [error, setError] = useState(null)
    const [info, setInfo] = useState(null)
    const [submitting, setSubmitting] = useState(false)

    const onSubmit = async (e) => {
        e.preventDefault()
        setError(null)
        setInfo(null)

        if (next.length < 8) {
            setError("New password must be at least 8 characters")
            return
        }
        if (next !== confirm) {
            setError("New password and confirmation do not match")
            return
        }

        setSubmitting(true)
        try {
            await api.changePassword(current, next)
            setInfo("Password changed. Signing you out…")
            setTimeout(() => {
                logout()
                navigate("/admin/login", { replace: true })
            }, 1500)
        } catch (err) {
            setError(err.message || "Could not change password")
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <>
            <PageHeader
                title="Change Password"
                description="You'll be signed out after a successful change."
            />

            <form onSubmit={onSubmit} className="max-w-md space-y-5">
                <TextField
                    label="Current password"
                    type="password"
                    value={current}
                    onChange={setCurrent}
                    required
                />
                <TextField
                    label="New password (min 8 chars)"
                    type="password"
                    value={next}
                    onChange={setNext}
                    required
                />
                <TextField
                    label="Confirm new password"
                    type="password"
                    value={confirm}
                    onChange={setConfirm}
                    required
                />

                {error && <p className="text-red-400 text-sm">{error}</p>}
                {info && <p className="text-yellow-500 text-sm">{info}</p>}

                <Button type="submit" disabled={submitting}>
                    {submitting ? "Changing…" : "Change password"}
                </Button>
            </form>
        </>
    )
}

export default ChangePasswordPage
