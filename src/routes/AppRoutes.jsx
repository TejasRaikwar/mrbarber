import { lazy, Suspense, useEffect } from "react"
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom"

import MainLayout from "@/layouts/MainLayout"
import { AuthProvider } from "@/context/AuthContext"

import Home from "@/pages/Home"
import ServicePage from "@/pages/Landing/ServicePage"
import BranchPage from "@/pages/Landing/BranchPage"
import NotFound from "@/pages/NotFound"
import { SERVICES, BRANCHES, servicePath, branchPath } from "@/seo/siteSeo"
import {
  heroSlidesSchema,
  marqueeSchema,
  servicesSchema,
  transformationsSchema,
  hairProfilesSchema,
  reviewsSchema,
  socialLinksSchema
} from "@/pages/admin/schemas"

// Admin and staff screens load on demand, so public visitors (and Google's
// page-speed checks) don't download the whole portal with the home page.
const AdminLayout = lazy(() => import("@/pages/admin/AdminLayout"))
const RequireAuth = lazy(() => import("@/pages/admin/RequireAuth"))
const AdminLogin = lazy(() => import("@/pages/admin/AdminLogin"))
const DashboardPage = lazy(() => import("@/pages/admin/DashboardPage"))
const RegisterPage = lazy(() => import("@/pages/admin/RegisterPage"))
const AppointmentPage = lazy(() => import("@/pages/admin/AppointmentPage"))
const EnquiriesPage = lazy(() => import("@/pages/admin/EnquiriesPage"))
const AdminReels = lazy(() => import("@/pages/admin/AdminReels"))
const StaffPage = lazy(() => import("@/pages/admin/StaffPage"))
const StaffLayout = lazy(() => import("@/pages/staff/StaffLayout"))
const SettingsPage = lazy(() => import("@/pages/admin/SettingsPage"))
const CrudPage = lazy(() => import("@/pages/admin/CrudPage"))
const LocationsPage = lazy(() => import("@/pages/admin/LocationsPage"))
const ChangePasswordPage = lazy(() => import("@/pages/admin/ChangePasswordPage"))

const PortalFallback = () => (
  <div className="min-h-screen flex items-center justify-center text-muted-foreground text-sm">Loading…</div>
)

// New page → start at the top (Home handles its own in-page section scrolling).
const ScrollToTop = () => {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

// URLs from the old WordPress site that Google still has indexed.
const LEGACY_SECTIONS = { about: "services", services: "services", contact: "contact" }

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AuthProvider>
        <Suspense fallback={<PortalFallback />}>
          <Routes>
            {/* Public site */}
            <Route element={<MainLayout />}>
              <Route path="/" element={<Home />} />
              {SERVICES.map((s) => (
                <Route key={s.slug} path={servicePath(s)} element={<ServicePage service={s} />} />
              ))}
              {BRANCHES.map((b) => (
                <Route key={b.slug} path={branchPath(b)} element={<BranchPage branch={b} />} />
              ))}
              {Object.entries(LEGACY_SECTIONS).map(([from, section]) => (
                <Route
                  key={from}
                  path={`/${from}`}
                  element={<Navigate to="/" replace state={{ scrollTo: section }} />}
                />
              ))}
              <Route path="*" element={<NotFound />} />
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
              <Route path="reels" element={<AdminReels />} />
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
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default AppRoutes
