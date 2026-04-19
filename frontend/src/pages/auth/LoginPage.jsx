import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { authApi } from '@/api/auth'
import { useAuthStore } from '@/store/authStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

const schema = z.object({
  email:    z.string().email('Invalid email'),
  password: z.string().min(1, 'Password is required'),
})

export default function LoginPage() {
  const navigate   = useNavigate()
  const { setAuth } = useAuthStore()
  const [error, setError] = useState('')

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
  })

  async function onSubmit(data) {
    setError('')
    try {
      const res = await authApi.login(data)
      setAuth(res.data.token, res.data.user)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] p-4">

      {/* Back to home logo */}
      <Link to="/" className="fixed top-5 left-5 flex items-center gap-2 group">
        <div className="w-8 h-8 rounded-lg bg-[#2E86AB] flex items-center justify-center group-hover:bg-[#1A6A8A] transition-colors">
          <span className="text-white font-bold text-sm">T</span>
        </div>
        <span className="font-bold text-[#1A2B5E] text-lg hidden sm:block group-hover:text-[#2E86AB] transition-colors">trvy</span>
      </Link>

      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto mb-3 w-10 h-10 rounded-full bg-[#2E86AB] flex items-center justify-center">
            <span className="text-white font-bold text-lg">T</span>
          </div>
          <CardTitle className="text-2xl text-[#1A2B5E]">Welcome back</CardTitle>
          <CardDescription>Sign in to your trvy account</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {error && (
              <div className="rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <div className="space-y-1">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="you@example.com" {...register('email')} />
              {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
            </div>

            <div className="space-y-1">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="••••••••" {...register('password')} />
              {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
            </div>

            <Button type="submit" className="w-full bg-[#2E86AB] hover:bg-[#1A6A8A]" disabled={isSubmitting}>
              {isSubmitting ? 'Signing in…' : 'Sign In'}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Don't have an account?{' '}
              <Link to="/register" className="text-[#2E86AB] hover:underline font-medium">Register</Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
