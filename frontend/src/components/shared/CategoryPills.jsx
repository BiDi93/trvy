import { useCategories } from '@/hooks/useServices'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

export default function CategoryPills({ selected, onSelect }) {
  const { data: categories = [], isLoading } = useCategories()

  if (isLoading) {
    return (
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-20 flex-shrink-0 rounded-xl" />
        ))}
      </div>
    )
  }

  return (
    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
      {/* All option */}
      <button
        onClick={() => onSelect('')}
        className={cn(
          'flex-shrink-0 flex flex-col items-center gap-1 px-4 py-3 rounded-xl border-2 transition-all text-sm font-medium',
          !selected
            ? 'border-[#1A2B5E] bg-[#1A2B5E] text-white'
            : 'border-gray-200 hover:border-gray-300 text-gray-600'
        )}
      >
        <span className="text-xl">🗂️</span>
        <span>All</span>
      </button>

      {categories.map(cat => (
        <button
          key={cat.slug}
          onClick={() => onSelect(cat.slug === selected ? '' : cat.slug)}
          className={cn(
            'flex-shrink-0 flex flex-col items-center gap-1 px-4 py-3 rounded-xl border-2 transition-all text-sm font-medium whitespace-nowrap',
            selected === cat.slug
              ? 'border-[#2E86AB] bg-[#2E86AB] text-white'
              : 'border-gray-200 hover:border-gray-300 text-gray-600 bg-white'
          )}
        >
          <span className="text-xl">{cat.icon}</span>
          <span>{cat.name}</span>
        </button>
      ))}
    </div>
  )
}
