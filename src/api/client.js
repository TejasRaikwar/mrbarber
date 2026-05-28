// Lightweight fetch wrapper with auth header injection + JSON handling.
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080"

const TOKEN_KEY = "mrbarber.token"

export const auth = {
    getToken: () => localStorage.getItem(TOKEN_KEY),
    setToken: (token) => localStorage.setItem(TOKEN_KEY, token),
    clear: () => localStorage.removeItem(TOKEN_KEY)
}

const request = async (path, { method = "GET", body, headers = {}, isFormData = false } = {}) => {
    const token = auth.getToken()
    const finalHeaders = {
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers
    }

    const res = await fetch(`${BASE_URL}${path}`, {
        method,
        headers: finalHeaders,
        body: isFormData ? body : body !== undefined ? JSON.stringify(body) : undefined
    })

    if (!res.ok) {
        let message = res.statusText
        try {
            const errBody = await res.json()
            if (errBody?.message) message = errBody.message
        } catch {
            // body wasn't JSON
        }
        const err = new Error(message)
        err.status = res.status
        throw err
    }

    if (res.status === 204) return null
    const text = await res.text()
    return text ? JSON.parse(text) : null
}

export const api = {
    // Auth
    login: (username, password) =>
        request("/api/auth/login", { method: "POST", body: { username, password } }),
    me: () => request("/api/auth/me"),
    changePassword: (currentPassword, newPassword) =>
        request("/api/auth/change-password", {
            method: "POST",
            body: { currentPassword, newPassword }
        }),

    // Public bulk fetch
    getSite: () => request("/api/public/site"),

    // Admin — generic CRUD helpers per resource
    listAdmin: (resource) => request(`/api/admin/${resource}`),
    createAdmin: (resource, body) =>
        request(`/api/admin/${resource}`, { method: "POST", body }),
    updateAdmin: (resource, id, body) =>
        request(`/api/admin/${resource}/${id}`, { method: "PUT", body }),
    deleteAdmin: (resource, id) =>
        request(`/api/admin/${resource}/${id}`, { method: "DELETE" }),

    // Settings (single-row, no id in path)
    getSettings: () => request("/api/admin/settings"),
    updateSettings: (body) =>
        request("/api/admin/settings", { method: "PUT", body }),

    // Staff management (admin only)
    listStaff: () => request("/api/admin/staff"),
    createStaff: (body) => request("/api/admin/staff", { method: "POST", body }),
    updateStaff: (id, body) => request(`/api/admin/staff/${id}`, { method: "PUT", body }),
    deleteStaff: (id) => request(`/api/admin/staff/${id}`, { method: "DELETE" }),

    // Appointments
    listAppointments: () => request("/api/admin/appointments"),
    createAppointment: (body) =>
        request("/api/admin/appointments", { method: "POST", body }),
    updateAppointment: (id, body) =>
        request(`/api/admin/appointments/${id}`, { method: "PUT", body }),
    deleteAppointment: (id) =>
        request(`/api/admin/appointments/${id}`, { method: "DELETE" }),

    // Dashboard
    getDashboardStats: () => request("/api/admin/dashboard/stats"),

    // Enquiries
    submitEnquiry: (body) =>
        request("/api/public/enquiry", { method: "POST", body }),
    listEnquiries: () => request("/api/admin/enquiries"),
    deleteEnquiry: (id) =>
        request(`/api/admin/enquiries/${id}`, { method: "DELETE" }),

    // File upload (multipart)
    uploadFile: (file) => {
        const form = new FormData()
        form.append("file", file)
        return request("/api/admin/files", {
            method: "POST",
            body: form,
            isFormData: true
        })
    }
}

export { BASE_URL }
