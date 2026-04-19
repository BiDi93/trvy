import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import Navbar from '@/components/shared/Navbar'
import CategoryPills from '@/components/shared/CategoryPills'
import ServiceCard from '@/components/shared/ServiceCard'
import { useServices } from '@/hooks/useServices'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { Search, MapPin, SlidersHorizontal } from 'lucide-react'

function ServiceCardSkeleton() {
  return (
    <div className="rounded-2xl overflow-hidden bg-white border border-gray-100">
      <Skeleton className="h-48 w-full" />
      <div className="p-4 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-3 w-full" />
      </div>
    </div>
  )
}

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams()

  const [q,        setQ]        = useState(searchParams.get('q')        ?? '')
  const [location, setLocation] = useState(searchParams.get('location') ?? '')
  const [category, setCategory] = useState(searchParams.get('category') ?? '')
  const [sort,     setSort]     = useState(searchParams.get('sort')     ?? '')

  // committed filters — only update on Search click or category pill click
  const [filters, setFilters] = useState({
    q:        searchParams.get('q')        ?? '',
    location: searchParams.get('location') ?? '',
    category: searchParams.get('category') ?? '',
    sort:     searchParams.get('sort')     ?? '',
  })

  const { data, isLoading } = useServices(filters)
  const services    = data?.data       ?? []
  const pagination  = data?.pagination ?? {}

  // sync filters → URL
  useEffect(() => {
    const params = {}
    if (filters.q)        params.q        = filters.q
    if (filters.location) params.location = filters.location
    if (filters.category) params.category = filters.category
    if (filters.sort)     params.sort     = filters.sort
    setSearchParams(params, { replace: true })
  }, [filters])

  function handleSearch() {
    setFilters({ q, location, category, sort })
  }

  function handleCategorySelect(slug) {
    const next = { ...filters, category: slug }
    setCategory(slug)
    setFilters(next)
  }

  function handleSortChange(val) {
    const next = { ...filters, sort: val === 'default' ? '' : val }
    setSort(val)
    setFilters(next)
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />

      {/* ── Hero ── */}
      <section className="bg-gradient-to-br from-[#1A2B5E] via-[#2E86AB] to-[#0F7B6C] py-14 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
            Find a skilled expert near you
          </h1>
          <p className="text-blue-100 mb-8 text-sm sm:text-base">
            Plumbing, electrical, IT, solar and more — book with confidence
          </p>

          {/* Search bar */}
          <div className="bg-white rounded-2xl shadow-xl p-2 flex flex-col sm:flex-row gap-2">
            <div className="flex items-center gap-2 flex-1 px-3">
              <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <Input
                value={q}
                onChange={e => setQ(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSearch()}
                placeholder="What service do you need?"
                className="border-0 shadow-none focus-visible:ring-0 p-0 h-9 text-base"
              />
            </div>

            <div className="hidden sm:block w-px bg-gray-200 my-1" />

            <div className="flex items-center gap-2 flex-1 px-3">
              <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <Input
                value={location}
                onChange={e => setLocation(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSearch()}
                placeholder="Location (e.g. Kuala Lumpur)"
                className="border-0 shadow-none focus-visible:ring-0 p-0 h-9 text-base"
              />
            </div>

            <Button
              onClick={handleSearch}
              className="bg-[#2E86AB] hover:bg-[#1A6A8A] rounded-xl px-6 h-11"
            >
              Search
            </Button>
          </div>
        </div>
      </section>

      {/* ── Main content ── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

        {/* Category pills */}
        <div className="mb-6">
          <CategoryPills selected={filters.category} onSelect={handleCategorySelect} />
        </div>

        {/* Results header */}
        <div className="flex items-center justify-between mb-5">
          <div className="text-sm text-gray-600">
            {isLoading ? (
              <Skeleton className="h-4 w-32" />
            ) : (
              <span>
                <span className="font-semibold text-[#1A2B5E]">{pagination.total ?? services.length}</span>
                {' '}service{pagination.total !== 1 ? 's' : ''} found
                {filters.category && <span className="text-[#2E86AB]"> in {filters.category}</span>}
                {filters.location  && <span className="text-[#2E86AB]"> · {filters.location}</span>}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-gray-500" />
            <Select value={sort || 'default'} onValueChange={handleSortChange}>
              <SelectTrigger className="w-40 h-9 text-sm">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Most Recent</SelectItem>
                <SelectItem value="rating">Top Rated</SelectItem>
                <SelectItem value="price_asc">Price: Low → High</SelectItem>
                <SelectItem value="price_desc">Price: High → Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => <ServiceCardSkeleton key={i} />)}
          </div>
        ) : services.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {services.map(service => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">🔍</p>
            <h3 className="text-lg font-semibold text-[#1A2B5E]">No services found</h3>
            <p className="text-sm text-gray-500 mt-1">
              Try a different keyword, category, or location
            </p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => { setQ(''); setLocation(''); setCategory(''); setFilters({}) }}
            >
              Clear filters
            </Button>
          </div>
        )}
      </main>
    </div>
  )
}
