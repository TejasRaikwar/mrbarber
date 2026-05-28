import { Navigate, useLocation } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"

const RequireAuth = ({ children, role }) => {
    const { user, loading } = useAuth()
    const location = useLocation()

    if (loading) {
        return (
            <div className="min-h-screen bg-black text-gray-400 flex items-center justify-center text-sm">
                Loading…
            </div>
        )
    }

    if (!user) {
        return <Navigate to="/admin/login" state={{ from: location }} replace />
    }

    // Role guard — staff can't enter admin, admin can still enter staff area
    if (role === "ADMIN" && user.role === "STAFF") {
        return <Navigate to="/staff" replace />
    }

    return children
}

export default RequireAuth
