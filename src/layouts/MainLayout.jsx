import { Outlet } from "react-router-dom"

import Navbar from "@/components/Navbar/Navbar"
import Footer from "@/components/Footer/Footer"
import AmbientBackground from "@/components/ui/AmbientBackground"

const MainLayout = () => {
    return (
        <div className="text-white min-h-screen flex flex-col relative">
            <AmbientBackground />
            <Navbar />
            <main className="flex-1">
                <Outlet />
            </main>
            <Footer />
        </div>
    )
}

export default MainLayout
