import { BrowserRouter, Routes, Route } from "react-router-dom"

import MainLayout from "@/layouts/MainLayout"
import AdminLayout from "@/layouts/AdminLayout"

import Home from "@/pages/Home"

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public Website */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
        </Route>

        {/* Admin */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<h1>Dashboard</h1>} />
        </Route>

      </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes