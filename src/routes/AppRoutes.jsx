import { BrowserRouter, Routes, Route } from "react-router-dom"

import MainLayout from "@/layouts/MainLayout"
import { AuthProvider } from "@/context/AuthContext"
import AdminLayout from "@/pages/admin/AdminLayout"
import RequireAuth from "@/pages/admin/RequireAuth"

import Home from "@/pages/Home"
import AdminLogin from "@/pages/admin/AdminLogin"
import DashboardPage from "@/pages/admin/DashboardPage"
import RegisterPage from "@/pages/admin/RegisterPage"
import AppointmentPage from "@/pages/admin/AppointmentPage"
import EnquiriesPage from "@/pages/admin/EnquiriesPage"

import StaffPage from "@/pages/admin/StaffPage"
import StaffLayout from "@/pages/staff/StaffLayout"
import SettingsPage from "@/pages/admin/SettingsPage"
import CrudPage from "@/pages/admin/CrudPage"
import LocationsPage from "@/pages/admin/LocationsPage"
import ChangePasswordPage from "@/pages/admin/ChangePasswordPage"
import {
  heroSlidesSchema,
  marqueeSchema,
  servicesSchema,
  transformationsSchema,
  hairProfilesSchema,
  reviewsSchema,
  socialLinksSchema
} from "@/pages/admin/schemas"

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public site */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
          </Route>

          {/* Admin */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin"
            element={
              <RequireAuth role="ADMIN">
                <AdminLayout />
              </RequireAuth>
            }
          >
            <Route index element={<DashboardPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="appointments" element={<AppointmentPage />} />
            <Route path="enquiries" element={<EnquiriesPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="change-password" element={<ChangePasswordPage />} />
            <Route path="hero-slides" element={<CrudPage schema={heroSlidesSchema} />} />
            <Route path="marquee" element={<CrudPage schema={marqueeSchema} />} />
            <Route path="services" element={<CrudPage schema={servicesSchema} />} />
            <Route path="transformations" element={<CrudPage schema={transformationsSchema} />} />
            <Route path="hair-profiles" element={<CrudPage schema={hairProfilesSchema} />} />
            <Route path="reviews" element={<CrudPage schema={reviewsSchema} />} />
            <Route path="locations" element={<LocationsPage />} />
            <Route path="social-links" element={<CrudPage schema={socialLinksSchema} />} />
            <Route path="staff" element={<StaffPage />} />
          </Route>

          {/* Staff portal */}
          <Route
            path="/staff"
            element={
              <RequireAuth>
                <StaffLayout />
              </RequireAuth>
            }
          >
            <Route index element={<AppointmentPage />} />
            <Route path="enquiries" element={<EnquiriesPage />} />
            <Route path="change-password" element={<ChangePasswordPage />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default AppRoutes
