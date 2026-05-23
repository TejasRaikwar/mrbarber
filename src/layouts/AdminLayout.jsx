import React from 'react'
import { Outlet } from 'react-router-dom'

const AdminLayout = () => {
    return (
        <div className="min-h-screen bg-zinc-950 text-white">
            <div className="flex">

                {/* Sidebar later */}
                <aside className="w-64 border-r border-white/10 p-5">
                    Admin Sidebar
                </aside>

                <main className="flex-1 p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}

export default AdminLayout
