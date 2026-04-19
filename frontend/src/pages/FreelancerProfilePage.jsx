import { useParams, useNavigate } from 'react-router-dom'
import { useFreelancer } from '@/hooks/useServices'
import Navbar from '@/components/shared/Navbar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { MapPin, Star, Briefcase, ShieldCheck, ArrowLeft } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'

function ProfileSkeleton() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <Skeleton className="h-8 w-48" />
      <div className="flex gap-5">
        <Skeleton className="w-24 h-24 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-64" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-28 rounded-2xl" />)}
      </div>
    </div>
  )
}

export default function FreelancerProfilePage() {
  const { id }     = useParams()
  const navigate   = useNavigate()
  const { user: me } = useAuthStore()

  const { data: freelancer, isLoading, isError } = useFreelancer(id)

  if (isLoading) return <div className="min-h-screen bg-[#F8FAFC]"><Navbar /><ProfileSkeleton /></div>

  if (isError || !freelancer) return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />
      <div className="text-center py-24">
        <p className="text-5xl mb-4">😕</p>
        <h2 className="text-lg font-semibold text-[#1A2B5E]">Freelancer not found</h2>
        <Button variant="outline" className="mt-4" onClick={() => navigate('/')}>Back to search</Button>
      </div>
    </div>
  )

  const { profile, services = [] } = freelancer

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">

        {/* Back */}
        <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-sm text-gray-500 hover:text-[#2E86AB] mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to results
        </button>

        {/* Profile header */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-5">
            <Avatar className="w-24 h-24 flex-shrink-0">
              <AvatarImage src={freelancer.avatar_url} />
              <AvatarFallback className="bg-[#2E86AB] text-white text-3xl">
                {freelancer.name[0]}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h1 className="text-2xl font-bold text-[#1A2B5E]">{freelancer.name}</h1>
                {freelancer.kyc_status === 'approved' && (
                  <Badge className="bg-[#0F7B6C] text-white gap-1">
                    <ShieldCheck className="w-3 h-3" /> Verified
                  </Badge>
                )}
              </div>

              {profile?.location && (
                <div className="flex items-center gap-1 text-sm text-gray-500 mb-2">
                  <MapPin className="w-3.5 h-3.5" />
                  {profile.location}
                </div>
              )}

              <div className="flex flex-wrap gap-4 text-sm mb-3">
                <div className="flex items-center gap-1 font-semibold">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span>{profile?.rating_avg?.toFixed(1) ?? '—'}</span>
                  <span className="text-gray-400 font-normal">rating</span>
                </div>
                <div className="flex items-center gap-1">
                  <Briefcase className="w-4 h-4 text-gray-400" />
                  <span className="font-semibold">{profile?.total_jobs ?? 0}</span>
                  <span className="text-gray-400">jobs completed</span>
                </div>
                {profile?.hourly_rate && (
                  <div>
                    <span className="font-semibold text-[#2E86AB]">RM {profile.hourly_rate}</span>
                    <span className="text-gray-400">/hr min.</span>
                  </div>
                )}
              </div>

              {profile?.bio && (
                <p className="text-sm text-gray-600 leading-relaxed">{profile.bio}</p>
              )}
            </div>

            {/* CTA — only show to logged-in customers */}
            {me?.role === 'customer' && (
              <div className="flex-shrink-0">
                <Button
                  className="bg-[#E86A10] hover:bg-orange-600 w-full sm:w-auto"
                  onClick={() => navigate(`/bookings/new/${freelancer.id}`)}
                >
                  Request this expert
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Services */}
        {services.length > 0 && (
          <div>
            <h2 className="text-lg font-bold text-[#1A2B5E] mb-4">Services offered</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {services.map(svc => (
                <div key={svc.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <Badge variant="outline" className="text-xs mb-2">
                        {svc.category?.icon} {svc.category?.name}
                      </Badge>
                      <h3 className="font-semibold text-[#1A2B5E] leading-snug">{svc.title}</h3>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="font-bold text-[#2E86AB]">RM {svc.min_price}</div>
                      <div className="text-xs text-gray-400">{svc.price_type === 'per_hour' ? '/hr' : 'fixed'}</div>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed line-clamp-3">{svc.description}</p>

                  {me?.role === 'customer' && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-3 w-full border-[#2E86AB] text-[#2E86AB] hover:bg-blue-50"
                      onClick={() => navigate(`/bookings/new/${freelancer.id}`)}
                    >
                      Book this service
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Certificates */}
        {profile?.certificates?.length > 0 && (
          <>
            <Separator className="my-6" />
            <h2 className="text-lg font-bold text-[#1A2B5E] mb-4">Certificates</h2>
            <div className="flex flex-wrap gap-3">
              {profile.certificates.map((cert, i) => (
                <a key={i} href={cert} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 text-sm text-[#2E86AB] hover:bg-blue-50 transition-colors">
                  📄 Certificate {i + 1}
                </a>
              ))}
            </div>
          </>
        )}

      </main>
    </div>
  )
}
