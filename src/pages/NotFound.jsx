import { Link } from "react-router-dom"
import { useEffect } from "react"
import { ServiceLinks } from "@/pages/Landing/LandingParts"

const NotFound = () => {
    useEffect(() => {
        document.title = "Page not found | Mr Barber"
        // Keep unknown URLs out of the index.
        const meta = document.createElement("meta")
        meta.name = "robots"
        meta.content = "noindex"
        meta.id = "robots-noindex"
        document.head.appendChild(meta)
        return () => meta.remove()
    }, [])

    return (
        <section className="bg-(--media-bg) pt-40 pb-24">
            <div className="max-w-5xl mx-auto px-6">
                <h1 className="text-4xl md:text-5xl font-extrabold text-(--media-foreground) mb-4">Page not found</h1>
                <p className="text-(--media-foreground)/75 mb-10">
                    That page doesn't exist. Head back to the <Link to="/" className="text-(--brand) underline">home page</Link>, or pick a service:
                </p>
                <ServiceLinks />
            </div>
        </section>
    )
}

export default NotFound
