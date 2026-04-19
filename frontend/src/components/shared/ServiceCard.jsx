import { useNavigate } from 'react-router-dom'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { MapPin, Star } from 'lucide-react'

export default function ServiceCard({ service }) {
  const navigate = useNavigate()
  const { freelancer, category } = service

  const image = service.images?.[0] || null
  const initials = freelancer?.name?.[0]?.toUpperCase() ?? '?'

  return (
    <div
      onClick={() => navigate(`/freelancers/${freelancer.id}`)}
      className="group cursor-pointer rounded-2xl overflow-hidden bg-white border border-gray-100 hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5"
    >
      {/* Image area */}
      <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
        {image ? (
          <img src={image} alt={service.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-6xl">{category?.icon ?? '🔧'}</span>
          </div>
        )}

        {/* Category badge */}
        <div className="absolute top-3 left-3">
          <Badge className="bg-white/90 text-[#1A2B5E] border-0 text-xs font-medium shadow-sm">
            {category?.icon} {category?.name}
          </Badge>
        </div>

        {/* KYC verified */}
        {freelancer?.kyc_status === 'approved' && (
          <div className="absolute top-3 right-3">
            <Badge className="bg-[#0F7B6C] text-white border-0 text-xs">✓ Verified</Badge>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Freelancer info */}
        <div className="flex items-center gap-2 mb-2">
          <Avatar className="w-7 h-7">
            <AvatarImage src={freelancer?.avatar_url} />
            <AvatarFallback className="bg-[#2E86AB] text-white text-xs">{initials}</AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium text-[#1A2B5E]">{freelancer?.name}</span>
        </div>

        {/* Title */}
        <h3 className="font-semibold text-gray-900 leading-snug mb-2 line-clamp-2">
          {service.title}
        </h3>

        {/* Location */}
        {freelancer?.location && (
          <div className="flex items-center gap-1 text-xs text-gray-500 mb-3">
            <MapPin className="w-3 h-3" />
            <span>{freelancer.location}</span>
          </div>
        )}

        {/* Footer: rating + price */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span className="text-sm font-semibold text-gray-800">{freelancer?.rating_avg?.toFixed(1) ?? '—'}</span>
            <span className="text-xs text-gray-400">({freelancer?.total_jobs} jobs)</span>
          </div>
          <div className="text-right">
            <span className="text-xs text-gray-400">From </span>
            <span className="font-bold text-[#1A2B5E]">RM {service.min_price}</span>
            {service.price_type === 'per_hour' && (
              <span className="text-xs text-gray-400">/hr</span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
