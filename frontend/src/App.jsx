import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from '@/components/ui/sonner'
import { ProtectedRoute } from '@/routes/ProtectedRoute'

import SearchPage            from '@/pages/SearchPage'
import LoginPage             from '@/pages/auth/LoginPage'
import RegisterPage          from '@/pages/auth/RegisterPage'
import FreelancerProfilePage from '@/pages/FreelancerProfilePage'
import CustomerDashboard     from '@/pages/customer/CustomerDashboard'
import FreelancerDashboard   from '@/pages/freelancer/FreelancerDashboard'

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, refetchOnWindowFocus: false } },
})

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/"                    element={<SearchPage />} />
          <Route path="/login"               element={<LoginPage />} />
          <Route path="/register"            element={<RegisterPage />} />
          <Route path="/freelancers/:id"     element={<FreelancerProfilePage />} />

          {/* Customer */}
          <Route element={<ProtectedRoute allowedRoles={['customer']} />}>
            <Route path="/customer/dashboard" element={<CustomerDashboard />} />
          </Route>

          {/* Freelancer */}
          <Route element={<ProtectedRoute allowedRoles={['freelancer']} />}>
            <Route path="/freelancer/dashboard" element={<FreelancerDashboard />} />
          </Route>

          {/* Admin */}
          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route path="/admin/*" element={<div className="p-8 text-[#1A2B5E] font-semibold">Admin panel — coming soon</div>} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['customer', 'freelancer', 'admin']} />}>
            <Route path="/settings" element={<div className="p-8 text-[#1A2B5E] font-semibold">Settings — coming soon</div>} />
          </Route>

          <Route path="/unauthorized" element={<div className="p-8 text-red-500">Access denied.</div>} />
          <Route path="*"             element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
      <Toaster />
    </QueryClientProvider>
  )
}
