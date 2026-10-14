import { Button } from '@/components/ui/button'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
}

export function LoadingSpinner({ size = 'md' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-16 w-16',
    md: 'h-32 w-32',
    lg: 'h-48 w-48'
  }

  return (
    <div className="flex justify-center items-center h-64">
      <div className={`animate-spin rounded-full border-b-2 border-gray-900 ${sizeClasses[size]}`}></div>
    </div>
  )
}

interface ErrorStateProps {
  message: string
  onRetry?: () => void
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="text-red-500 text-center py-8">
      <p>{message}</p>
      {onRetry && (
        <Button onClick={onRetry} className="mt-4">
          Retry
        </Button>
      )}
    </div>
  )
}

interface EmptyStateProps {
  message: string
  onClearFilters?: () => void
  showClearButton?: boolean
}

export function EmptyState({ message, onClearFilters, showClearButton = false }: EmptyStateProps) {
  return (
    <div className="text-center py-8">
      <p className="text-gray-500">{message}</p>
      {showClearButton && onClearFilters && (
        <Button onClick={onClearFilters} className="mt-4">
          Clear all filters
        </Button>
      )}
    </div>
  )
}
