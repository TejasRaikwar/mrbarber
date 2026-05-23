import { Outlet } from "react-router-dom"

import Navbar from "@/components/navbar/Navbar"

const MainLayout = () => {
    return (
        <div className="bg-black min-h-screen text-white">
            <Navbar />
            <main>
                <Outlet />
            </main>
        </div>
    )
}

export default MainLayout
