import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { authApi } from '@/api/auth'
import { Button } from '@/components/ui/button'

export default function CustomerDashboard() {
  const { user, clearAuth } = useAuthStore()
  const navigate = useNavigate()

  async function logout() {
    await authApi.logout().catch(() => {})
    clearAuth()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-[#1A2B5E]">Welcome, {user?.name} 👋</h1>
            <p className="text-muted-foreground text-sm mt-1">Customer Dashboard</p>
          </div>
          <Button variant="outline" onClick={logout}>Sign out</Button>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          {[['Active Bookings','0','#2E86AB'],['Completed Jobs','0','#0F7B6C'],['Pending Reviews','0','#E86A10']].map(([label, val, color]) => (
            <div key={label} className="rounded-xl border bg-white p-5 shadow-sm">
              <p className="text-sm text-muted-foreground">{label}</p>
              <p className="text-3xl font-bold mt-1" style={{ color }}>{val}</p>
            </div>
          ))}
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm text-center text-muted-foreground">
          <p className="text-4xl mb-3">🔍</p>
          <p className="font-medium text-[#1A2B5E]">Find a freelancer</p>
          <p className="text-sm mt-1">Services & booking coming in the next sprint</p>
        </div>
      </div>
    </div>
  )
}
