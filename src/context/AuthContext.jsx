import { createContext, useContext, useEffect, useState, useCallback } from "react"
import { api, auth as tokenStore } from "@/api/client"

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    const fetchMe = useCallback(async () => {
        if (!tokenStore.getToken()) {
            setUser(null)
            setLoading(false)
            return
        }
        try {
            const me = await api.me()
            setUser(me)
        } catch {
            tokenStore.clear()
            setUser(null)
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchMe()
    }, [fetchMe])

    // Step 1: credentials check out -> an OTP is emailed; returns { otpRequired, maskedEmail }.
    const requestOtp = async (username, password) => {
        return api.login(username, password)
    }

    // Step 2: OTP verified -> token issued and session established.
    const verifyOtp = async (username, otp) => {
        const res = await api.verifyOtp(username, otp)
        tokenStore.setToken(res.token)
        await fetchMe()
        return res
    }

    const logout = () => {
        tokenStore.clear()
        setUser(null)
    }

    return (
        <AuthContext.Provider value={{ user, loading, requestOtp, verifyOtp, logout, refresh: fetchMe }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const ctx = useContext(AuthContext)
    if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>")
    return ctx
}
