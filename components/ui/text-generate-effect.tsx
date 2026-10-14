'use client'

import { useEffect } from 'react'
import { motion, stagger, useAnimate } from 'framer-motion'
import { cn } from '@/lib/utils'

export const TextGenerateEffect = ({
  words,
  className,
  filter = true,
  duration = 0.5,
  delay = 0.2,
}: {
  words: string
  className?: string
  filter?: boolean
  duration?: number
  delay?: number
}) => {
  const [scope, animate] = useAnimate()
  const wordsArray = words.split(' ')

  useEffect(() => {
    const animation = async () => {
      await animate(
        'span',
        {
          opacity: 1,
          filter: filter ? 'blur(0px)' : 'none',
        },
        {
          duration: duration,
          delay: stagger(delay),
        }
      )
    }
    animation()
  }, [words])

  const renderWords = () => {
    return (
      <motion.div ref={scope} className='inline'>
        {wordsArray.map((word, idx) => (
          <motion.span
            key={`${word}-${idx}`}
            className={cn(
              'inline-block opacity-0 mr-1.5',
              word === 'INTERMEDIANO' && 'font-extrabold text-primary'
            )}
            style={{
              filter: filter ? 'blur(8px)' : 'none',
              transition: 'filter 0.3s ease-out',
            }}
          >
            {word}
          </motion.span>
        ))}
      </motion.div>
    )
  }
  return (
    <div className={cn('font-bold leading-relaxed tracking-wide', className)}>
      <div className='text-balance text-lg md:text-xl lg:text-2xl'>
        {renderWords()}
      </div>
    </div>
  )
}
