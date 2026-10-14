'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { CATEGORY_INFO } from '@/features/disc/constants/adjectives'
import { TestResults } from '@/features/disc/types'

interface DiscProfileTooltipProps {
  profile: TestResults
  title: string
}

export function DiscProfileTooltip({ profile, title }: DiscProfileTooltipProps) {
  const [hoveredKey, setHoveredKey] = useState<string | null>(null)
  const springConfig = { stiffness: 100, damping: 5 }
  const x = useMotionValue(0)
  
  const rotate = useSpring(
    useTransform(x, [-100, 100], [-10, 10]),
    springConfig
  )
  
  const translateX = useSpring(
    useTransform(x, [-100, 100], [-20, 20]),
    springConfig
  )

  const total = Object.values(profile).reduce((a, b) => a + b, 0)

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const halfWidth = event.currentTarget.offsetWidth / 2
    x.set(event.nativeEvent.offsetX - halfWidth)
  }

  return (
    <div className='flex items-center justify-center gap-2'>
      {Object.entries(CATEGORY_INFO).map(([key, info]) => {
        const value = profile[key as keyof TestResults]
        const percentage = Math.round((value / total) * 100)
        
        return (
          <div
            key={key}
            className='group relative'
            onMouseEnter={() => setHoveredKey(key)}
            onMouseLeave={() => setHoveredKey(null)}
          >
            <AnimatePresence mode='popLayout'>
              {hoveredKey === key && (
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.6 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    transition: {
                      type: 'spring',
                      stiffness: 260,
                      damping: 10,
                    },
                  }}
                  exit={{ opacity: 0, y: 20, scale: 0.6 }}
                  style={{
                    translateX: translateX,
                    rotate: rotate,
                    whiteSpace: 'nowrap',
                    background: info.color,
                  }}
                  className='absolute -top-20 left-1/2 z-50 flex -translate-x-1/2 flex-col items-center justify-center rounded-md px-3 py-2 text-xs shadow-xl'
                  onMouseMove={handleMouseMove}
                >
                  <div className='absolute inset-x-10 -bottom-px z-30 h-px w-[20%] bg-gradient-to-r from-transparent via-white to-transparent opacity-50' />
                  <div className='absolute -bottom-px left-10 z-30 h-px w-[40%] bg-gradient-to-r from-transparent via-white to-transparent opacity-70' />
                  <div className='relative z-30 text-sm font-bold text-white'>
                    {percentage}%
                  </div>
                  <div className='text-[10px] text-white opacity-90'>{title}</div>
                  <div className='text-[9px] text-white opacity-75'>{info.title}</div>
                </motion.div>
              )}
            </AnimatePresence>
            <motion.div
              onMouseMove={handleMouseMove}
              className='relative flex h-12 w-12 items-center justify-center rounded-full border-2 border-white font-bold text-lg shadow-md transition duration-500 group-hover:z-30 group-hover:scale-110 cursor-pointer'
              style={{ 
                background: info.color,
                color: '#fff'
              }}
              whileHover={{ scale: 1.1 }}
            >
              {key}
            </motion.div>
          </div>
        )
      })}
    </div>
  )
}

