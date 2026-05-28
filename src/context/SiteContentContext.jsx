import { createContext, useContext, useEffect, useState, useCallback } from "react"
import { api } from "@/api/client"

const SiteContentContext = createContext(null)

const EMPTY = {
    settings: null,
    navLinks: [],
    heroSlides: [],
    marqueeItems: [],
    services: [],
    transformations: [],
    hairProfiles: [],
    reviews: [],
    locations: [],
    socialLinks: []
}

export const SiteContentProvider = ({ children }) => {
    const [data, setData] = useState(EMPTY)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const refresh = useCallback(async () => {
        try {
            setLoading(true)
            const site = await api.getSite()
            setData({ ...EMPTY, ...site })
            setError(null)
        } catch (e) {
            setError(e)
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        refresh()
    }, [refresh])

    return (
        <SiteContentContext.Provider value={{ ...data, loading, error, refresh }}>
            {children}
        </SiteContentContext.Provider>
    )
}

export const useSiteContent = () => {
    const ctx = useContext(SiteContentContext)
    if (!ctx) {
        throw new Error("useSiteContent must be used inside <SiteContentProvider>")
    }
    return ctx
}
