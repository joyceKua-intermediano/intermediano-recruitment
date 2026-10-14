import React from 'react'
import { cn } from '@/lib/utils'

export const Spinner = ({
  size = 'md',
  className = ''
}: {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  }

  return (
    <div
      className={cn(
        'animate-spin rounded-full border-2 border-gray-300 border-t-primary',
        sizeClasses[size],
        className
      )}
    />
  )
}

export const PulseLoader = ({
  className = '',
  lines = 3
}: {
  className?: string
  lines?: number
}) => {
  // Use deterministic widths to prevent hydration errors
  const widthClasses = [
    'w-3/4',
    'w-1/2',
    'w-2/3',
    'w-4/5',
    'w-3/5',
    'w-5/6',
    'w-2/5',
    'w-7/8'
  ]

  return (
    <div className={cn('space-y-3', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "h-4 bg-gray-200 rounded animate-pulse",
            widthClasses[i % widthClasses.length]
          )}
        />
      ))}
    </div>
  )
}

export const SkeletonCard = ({
  className = '',
  height = 'h-32'
}: {
  className?: string
  height?: string
}) => {
  return (
    <div className={cn(
      'bg-gray-200 rounded-lg animate-pulse',
      height,
      className
    )} />
  )
}

export const PageLoader = ({
  message = 'Loading...'
}: {
  message?: string
}) => {
  return (
    <div className="fixed inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="text-center">
        <Spinner size="xl" className="mx-auto mb-4" />
        <p className="text-gray-600 dark:text-gray-400 font-medium">{message}</p>
      </div>
    </div>
  )
}

export const ButtonLoader = ({
  size = 'sm'
}: {
  size?: 'sm' | 'md' | 'lg'
}) => {
  return (
    <div className="flex items-center gap-2">
      <Spinner size={size} />
      <span>Loading...</span>
    </div>
  )
}

export const TableSkeleton = ({
  rows = 5,
  columns = 4
}: {
  rows?: number
  columns?: number
}) => {
  return (
    <div className="space-y-3">

      <div className="flex gap-4">
        {Array.from({ length: columns }).map((_, i) => (
          <div
            key={i}
            className="h-4 bg-gray-200 rounded animate-pulse flex-1"
          />
        ))}
      </div>

      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex gap-4">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <div
              key={colIndex}
              className="h-3 bg-gray-100 rounded animate-pulse flex-1"
            />
          ))}
        </div>
      ))}
    </div>
  )
}

export const CardSkeleton = ({
  className = '',
  showImage = true,
  lines = 3
}: {
  className?: string
  showImage?: boolean
  lines?: number
}) => {
  // Use deterministic widths to prevent hydration errors
  const widthClasses = [
    'w-3/4',
    'w-1/2',
    'w-2/3',
    'w-4/5',
    'w-3/5',
    'w-5/6',
    'w-2/5',
    'w-7/8'
  ]

  return (
    <div className={cn('bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm', className)}>
      {showImage && (
        <div className="w-full h-32 bg-gray-200 rounded-lg animate-pulse mb-4" />
      )}
      <div className="space-y-3">
        <div className="h-5 bg-gray-200 rounded animate-pulse w-3/4" />
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={cn(
              "h-3 bg-gray-100 rounded animate-pulse",
              widthClasses[i % widthClasses.length]
            )}
          />
        ))}
      </div>
    </div>
  )
}

export const ProgressLoader = ({
  progress = 0,
  className = ''
}: {
  progress?: number
  className?: string
}) => {
  return (
    <div className={cn('w-full bg-gray-200 rounded-full h-2', className)}>
      <div
        className="bg-primary h-2 rounded-full transition-all duration-300 ease-out"
        style={{ width: `${Math.min(progress, 100)}%` }}
      />
    </div>
  )
}

export const ShimmerLoader = ({
  className = '',
  height = 'h-4'
}: {
  className?: string
  height?: string
}) => {
  return (
    <div className={cn(
      'relative overflow-hidden bg-gray-200 rounded',
      height,
      className
    )}>
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent" />
    </div>
  )
}
