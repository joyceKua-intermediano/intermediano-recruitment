import React, { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { BarChart3, Home } from 'lucide-react'
import { CATEGORY_INFO } from '../constants/adjectives'
import { COLOR_PRIMARY, COLOR_SECONDARY, COLOR_BORDER, COLOR_CARD } from '../constants/colors'
import { getPercentage, calculateTotalScore } from '../services/discCalculations'
import { ResultsProps, TestResults } from '../types'
import { useSaveDiscResult } from '@/features/applicant/hooks/useSaveDiscResult'
import { useRouter } from 'next/navigation'

export function DiscResults({ naturalProfile, adaptedProfile }: ResultsProps) {
  const totalNatural = calculateTotalScore(naturalProfile)
  const totalAdapted = calculateTotalScore(adaptedProfile)
  const { mutate: saveDiscResult } = useSaveDiscResult()
  const router = useRouter()

  useEffect(() => {
    saveDiscResult({
      naturalProfile,
      adaptedProfile,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className='max-w-6xl mx-auto'
    >
      <Card className='shadow-md border-0' style={{ background: COLOR_CARD }}>
        <CardHeader className='text-center border-b pb-6' style={{ borderColor: COLOR_BORDER }}>
          <div className='flex justify-center mb-6'>
            <div
              className='w-16 h-16 rounded-xl flex items-center justify-center shadow'
              style={{ background: COLOR_PRIMARY }}
            >
              <BarChart3 className='w-8 h-8 text-white' />
            </div>
          </div>
          <CardTitle className='text-3xl font-bold mb-3' style={{ color: COLOR_PRIMARY }}>
            Your DISC Profile Results
          </CardTitle>
          <p className='text-base max-w-2xl mx-auto' style={{ color: COLOR_SECONDARY }}>
            Understanding your natural and adapted behavioral styles
          </p>
        </CardHeader>
        <CardContent className='pt-8 space-y-8'>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
            <ProfileSection 
              title="Self-Perception" 
              profile={naturalProfile} 
              total={totalNatural} 
            />
            <ProfileSection 
              title="Social Perception" 
              profile={adaptedProfile} 
              total={totalAdapted} 
            />
          </div>
          <div 
            className='flex flex-col sm:flex-row justify-center gap-4 pt-6 border-t' 
            style={{ borderColor: COLOR_BORDER }}
          >
            <Button
              onClick={() => router.push('/dashboard')}
              className='flex items-center gap-2'
              style={{ 
                background: COLOR_PRIMARY,
                color: 'white'
              }}
            >
              <Home className='w-4 h-4' />
              Go to Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

interface ProfileSectionProps {
  title: string
  profile: TestResults
  total: number
}

function ProfileSection({ title, profile, total }: ProfileSectionProps) {
  return (
    <div>
      <h3 className='text-xl font-bold mb-5 pb-3 border-b' style={{ color: COLOR_PRIMARY, borderColor: COLOR_BORDER }}>
        <span className='block text-sm font-normal mt-1' style={{ color: COLOR_SECONDARY }}>
          {title}
        </span>
      </h3>
      <div className='space-y-4'>
        {Object.entries(CATEGORY_INFO).map(([key, info]) => {
          const value = profile[key as keyof TestResults]
          const percentage = getPercentage(value, total)
          return (
            <div key={key}>
              <div className='flex items-center justify-between mb-2'>
                <div className='flex items-center gap-2'>
                  <div
                    className='w-7 h-7 rounded-md flex items-center justify-center text-white font-bold text-xs shadow-sm'
                    style={{ background: info.color }}
                  >
                    {key}
                  </div>
                  <span className='font-medium text-sm' style={{ color: COLOR_PRIMARY }}>
                    {info.title}
                  </span>
                </div>
                <span className='font-bold text-sm' style={{ color: info.color }}>
                  {percentage}%
                </span>
              </div>
              <div 
                className='w-full h-3 rounded-full overflow-hidden' 
                style={{ background: '#e0d6d1' }}
              >
                <motion.div
                  className='h-full rounded-full'
                  style={{ background: info.color }}
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 1, delay: 0.2 }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

