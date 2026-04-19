import { useQuery } from '@tanstack/react-query'
import { servicesApi } from '@/api/services'

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn:  () => servicesApi.categories().then(r => r.data),
    staleTime: 1000 * 60 * 10, // 10 min
  })
}

export function useServices(filters = {}) {
  // strip empty values so URL stays clean
  const params = Object.fromEntries(
    Object.entries(filters).filter(([, v]) => v !== '' && v !== null && v !== undefined)
  )

  return useQuery({
    queryKey: ['services', params],
    queryFn:  () => servicesApi.list(params).then(r => r.data),
    keepPreviousData: true,
  })
}

export function useFreelancer(id) {
  return useQuery({
    queryKey: ['freelancer', id],
    queryFn:  () => servicesApi.freelancer(id).then(r => r.data),
    enabled:  !!id,
  })
}
