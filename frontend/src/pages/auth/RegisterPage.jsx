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

const baseSchema = z.object({
  name:                  z.string().min(2, 'Name must be at least 2 characters'),
  email:                 z.string().email('Invalid email'),
  password:              z.string().min(8, 'Password must be at least 8 characters'),
  password_confirmation: z.string(),
  role:                  z.enum(['customer', 'freelancer']),
  phone:                 z.string().optional(),
}).refine(d => d.password === d.password_confirmation, {
  message: 'Passwords do not match',
  path: ['password_confirmation'],
})

const freelancerSchema = baseSchema.and(z.object({
  bio:         z.string().optional(),
  location:    z.string().min(2, 'Location is required for freelancers'),
  hourly_rate: z.coerce.number().min(1, 'Hourly rate must be at least 1').optional(),
}))

export default function RegisterPage() {
  const navigate    = useNavigate()
  const { setAuth } = useAuthStore()
  const [step, setStep]   = useState(1)
  const [role, setRole]   = useState('')
  const [error, setError] = useState('')

  const { register, handleSubmit, watch, trigger, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(role === 'freelancer' ? freelancerSchema : baseSchema),
    defaultValues: { role: '' },
  })

  const watchedRole = watch('role')

  async function goToStep2() {
    const valid = await trigger(['name', 'email', 'password', 'password_confirmation', 'role'])
    if (valid) {
      setRole(watchedRole)
      setStep(2)
    }
  }

  async function onSubmit(data) {
    setError('')
    try {
      const res = await authApi.register(data)
      setAuth(res.data.token, res.data.user)
      navigate('/')
    } catch (err) {
      const msg = err.response?.data?.message || ''
      const valErrors = err.response?.data?.errors || {}
      const first = Object.values(valErrors)[0]?.[0]
      setError(first || msg || 'Registration failed.')
      setStep(1)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto mb-3 w-10 h-10 rounded-full bg-[#2E86AB] flex items-center justify-center">
            <span className="text-white font-bold text-lg">S</span>
          </div>
          <CardTitle className="text-2xl text-[#1A2B5E]">Create an account</CardTitle>
          <CardDescription>
            Step {step} of {watchedRole === 'freelancer' ? '2' : '2'}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {error && (
              <div className="rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {/* ── Step 1: basics ── */}
            {step === 1 && (
              <>
                <div className="space-y-1">
                  <Label>I am a</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {['customer', 'freelancer'].map((r) => (
                      <label key={r} className={`cursor-pointer rounded-lg border-2 p-3 text-center transition-all ${watchedRole === r ? 'border-[#2E86AB] bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
                        <input type="radio" value={r} {...register('role')} className="sr-only" />
                        <div className="text-2xl mb-1">{r === 'customer' ? '🙋' : '🔧'}</div>
                        <div className="text-sm font-medium capitalize">{r}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">
                          {r === 'customer' ? 'Hire experts' : 'Offer services'}
                        </div>
                      </label>
                    ))}
                  </div>
                  {errors.role && <p className="text-xs text-red-500">{errors.role.message}</p>}
                </div>

                <div className="space-y-1">
                  <Label>Full name</Label>
                  <Input placeholder="Ali Hassan" {...register('name')} />
                  {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
                </div>

                <div className="space-y-1">
                  <Label>Email</Label>
                  <Input type="email" placeholder="ali@example.com" {...register('email')} />
                  {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
                </div>

                <div className="space-y-1">
                  <Label>Password</Label>
                  <Input type="password" placeholder="Min. 8 characters" {...register('password')} />
                  {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
                </div>

                <div className="space-y-1">
                  <Label>Confirm password</Label>
                  <Input type="password" placeholder="Repeat password" {...register('password_confirmation')} />
                  {errors.password_confirmation && <p className="text-xs text-red-500">{errors.password_confirmation.message}</p>}
                </div>

                <Button type="button" onClick={goToStep2} className="w-full bg-[#2E86AB] hover:bg-[#1A6A8A]">
                  Continue →
                </Button>
              </>
            )}

            {/* ── Step 2: role-specific ── */}
            {step === 2 && (
              <>
                {watchedRole === 'freelancer' ? (
                  <>
                    <p className="text-sm text-muted-foreground">Tell customers about yourself</p>

                    <div className="space-y-1">
                      <Label>Location <span className="text-red-500">*</span></Label>
                      <Input placeholder="e.g. Kuala Lumpur" {...register('location')} />
                      {errors.location && <p className="text-xs text-red-500">{errors.location.message}</p>}
                    </div>

                    <div className="space-y-1">
                      <Label>Minimum rate (MYR/hr)</Label>
                      <Input type="number" placeholder="e.g. 80" {...register('hourly_rate')} />
                      {errors.hourly_rate && <p className="text-xs text-red-500">{errors.hourly_rate.message}</p>}
                    </div>

                    <div className="space-y-1">
                      <Label>About you</Label>
                      <textarea
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E86AB] min-h-[80px] resize-none"
                        placeholder="Describe your skills and experience…"
                        {...register('bio')}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <p className="text-sm text-muted-foreground">Optional — add your phone number</p>
                    <div className="space-y-1">
                      <Label>Phone (optional)</Label>
                      <Input type="tel" placeholder="+601X-XXXXXXX" {...register('phone')} />
                    </div>
                  </>
                )}

                <div className="flex gap-3">
                  <Button type="button" variant="outline" onClick={() => setStep(1)} className="flex-1">
                    ← Back
                  </Button>
                  <Button type="submit" className="flex-1 bg-[#2E86AB] hover:bg-[#1A6A8A]" disabled={isSubmitting}>
                    {isSubmitting ? 'Creating…' : 'Create Account'}
                  </Button>
                </div>
              </>
            )}

            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link to="/login" className="text-[#2E86AB] hover:underline font-medium">Sign in</Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
