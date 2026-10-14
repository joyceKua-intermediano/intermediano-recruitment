'use client'

import React, { useState, useEffect } from 'react'
import { CardContent } from '@/components/ui/card'
import { DiscProfileTooltip } from '@/app/dashboard/_components/applicant/DiscProfileTooltip'
import { TestResults } from '../types'

interface DiscCardContentProps {
  discResult?: {
    naturalProfile: TestResults
    adaptedProfile: TestResults
  } | null
  showLabels?: boolean
  compact?: boolean
}

export function DiscCardContent({
  discResult,
  showLabels = true,
  compact = false
}: DiscCardContentProps) {
  const COLOR_PRIMARY = '#374151'
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted || !discResult) {
    return (
      <CardContent className={compact ? 'p-2' : ''}>
        <div className='space-y-2'>
          <div className='text-center'>
            <div
              className={`${compact ? 'text-xs' : 'text-sm'} font-medium mb-2`}
              style={{ color: COLOR_PRIMARY }}
            >
              {compact ? 'No test' : 'Discover Your Profile'}
            </div>
          </div>
          {!compact && (
            <div className='flex justify-center items-center gap-2 pt-2'>
              <span className='text-xs font-semibold' style={{ color: COLOR_PRIMARY }}>
                Start Test
              </span>
            </div>
          )}
        </div>
      </CardContent>
    )
  }

  return (
    <CardContent className={compact ? 'p-2 space-y-2' : 'space-y-4'}>
      <div className={compact ? 'space-y-1' : 'space-y-1'}>
        <div>
          {showLabels && (
            <div className={`${compact ? 'text-[10px]' : 'text-xs'} font-semibold text-center mb-1`} style={{ color: COLOR_PRIMARY }}>
              {compact ? 'Self' : 'Self-Perception'}
            </div>
          )}
          <DiscProfileTooltip
            profile={discResult.naturalProfile}
            title='Self-Perception'
          />
        </div>
        <div>
          {showLabels && (
            <div className={`${compact ? 'text-[10px]' : 'text-xs'} font-semibold text-center mb-1`} style={{ color: COLOR_PRIMARY }}>
              {compact ? 'Social' : 'Social Perception'}
            </div>
          )}
          <DiscProfileTooltip
            profile={discResult.adaptedProfile}
            title='Social Perception'
          />
        </div>
      </div>
    </CardContent>
  )
}
