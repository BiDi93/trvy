import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { authApi } from '@/api/auth'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu, DropdownMenuContent,
  DropdownMenuGroup, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { LayoutDashboard, Settings, LogOut } from 'lucide-react'

export default function Navbar() {
  const { user, token, clearAuth } = useAuthStore()
  const navigate = useNavigate()

  async function logout() {
    await authApi.logout().catch(() => {})
    clearAuth()
    navigate('/')
  }

  const dashboardPath = user?.role === 'freelancer'
    ? '/freelancer/dashboard'
    : user?.role === 'admin'
    ? '/admin/kyc'
    : '/customer/dashboard'

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#2E86AB] flex items-center justify-center">
            <span className="text-white font-bold text-sm">T</span>
          </div>
          <span className="font-bold text-[#1A2B5E] text-lg hidden sm:block">trvy</span>
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {token && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-2 rounded-full border border-gray-200 pl-3 pr-1 py-1 hover:shadow-md transition-shadow cursor-pointer">
                <span className="text-sm font-medium text-[#1A2B5E] hidden sm:block">
                  {user.name.split(' ')[0]}
                </span>
                <Avatar className="w-8 h-8">
                  <AvatarImage src={user.avatar_url} />
                  <AvatarFallback className="bg-[#2E86AB] text-white text-xs">
                    {user.name[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                {/* User info — plain div, no group context needed */}
                <div className="px-2 py-2 border-b border-gray-100 mb-1">
                  <p className="text-sm font-semibold text-[#1A2B5E] truncate">{user.name}</p>
                  <p className="text-xs text-gray-400 truncate">{user.email}</p>
                </div>

                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={() => navigate(dashboardPath)} className="gap-2 cursor-pointer">
                    <LayoutDashboard className="w-4 h-4 text-gray-500" />
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/settings')} className="gap-2 cursor-pointer">
                    <Settings className="w-4 h-4 text-gray-500" />
                    Settings
                  </DropdownMenuItem>
                </DropdownMenuGroup>

                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={logout} className="gap-2 cursor-pointer text-red-600">
                    <LogOut className="w-4 h-4" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" size="sm" className="text-[#1A2B5E]">Sign in</Button>
              </Link>
              <Link to="/register">
                <Button size="sm" className="bg-[#2E86AB] hover:bg-[#1A6A8A]">Register</Button>
              </Link>
            </>
          )}
        </div>

      </div>
    </header>
  )
}
