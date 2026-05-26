import { useCallback } from "react"
import { useLocation, useNavigate } from "react-router-dom"

// Returns a click handler that smoothly scrolls to a section on the home page,
// or navigates to "/" first (with the hash in state) when on another route.
export const useSectionNav = () => {
    const navigate = useNavigate()
    const location = useLocation()

    const scrollToHash = useCallback((hash) => {
        if (!hash) {
            window.scrollTo({ top: 0, behavior: "smooth" })
            return
        }
        const el = document.getElementById(hash)
        if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "start" })
        }
    }, [])

    const handleNavClick = useCallback(
        (e, hash) => {
            e.preventDefault()
            if (location.pathname !== "/") {
                navigate("/", { state: { scrollTo: hash } })
            } else {
                scrollToHash(hash)
            }
        },
        [location.pathname, navigate, scrollToHash]
    )

    return { handleNavClick, scrollToHash }
}
