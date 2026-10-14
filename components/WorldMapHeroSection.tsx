'use client'

import { motion } from 'framer-motion'
import { TextGenerateEffect } from './ui/text-generate-effect'
import { Globe, ArrowRight, Users, Star, Zap } from 'lucide-react'
import WorldMap from './ui/world-map'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useUser } from '@auth0/nextjs-auth0'

export function WorldMapHeroSection() {
  const router = useRouter()
  const { user, isLoading } = useUser()

  const handleGetStarted = () => {
    if (user) {
      router.push('/dashboard')
    } else {
      router.push('/auth/login')
    }
  }

  const words = `INTERMEDIANO - Global Talent Platform connecting global talent to opportunities without borders. Intermediano Recruitment offers access to main global employers with speed, convenience and safety.`

  const connections = [
    { start: { lat: -9.19, lng: -75.015 }, end: { lat: 8.537, lng: -80.782 } }, // Peru to Panama
    {
      start: { lat: 8.537, lng: -80.782 },
      end: { lat: -32.5228, lng: -55.7658 },
    }, // Panama to Uruguay
    {
      start: { lat: -32.5228, lng: -55.7658 },
      end: { lat: 56.1304, lng: -106.3468 },
    }, // Uruguay to Canada
    {
      start: { lat: 56.1304, lng: -106.3468 },
      end: { lat: -14.235, lng: -51.9253 },
    }, // Canada to Brazil
    {
      start: { lat: -14.235, lng: -51.9253 },
      end: { lat: 4.5709, lng: -74.2973 },
    }, // Brazil to Colombia
    {
      start: { lat: 4.5709, lng: -74.2973 },
      end: { lat: 22.3964, lng: 114.1095 },
    }, // Colombia to Hong Kong
    {
      start: { lat: 22.3964, lng: 114.1095 },
      end: { lat: -1.8312, lng: -78.1834 },
    }, // Hong Kong to Ecuador
    {
      start: { lat: -1.8312, lng: -78.1834 },
      end: { lat: 9.7489, lng: -83.7534 },
    }, // Ecuador to Costa Rica
    {
      start: { lat: 9.7489, lng: -83.7534 },
      end: { lat: 18.1096, lng: -77.2975 },
    }, // Costa Rica to Jamaica
    {
      start: { lat: 18.1096, lng: -77.2975 },
      end: { lat: 13.4125, lng: 122.5621 },
    }, // Jamaica to Philippines
    {
      start: { lat: 13.4125, lng: 122.5621 },
      end: { lat: -35.6751, lng: -71.543 },
    }, // Philippines to Chile
    {
      start: { lat: -35.6751, lng: -71.543 },
      end: { lat: 23.6345, lng: -102.5528 },
    }, // Chile to Mexico
  ]

  const stats = [
    { icon: Users, value: '10+', label: 'Local presence' },
    { icon: Star, value: '120+', label: 'Countries covered' },
    { icon: Globe, value: '10+', label: 'Global clients' },
    { icon: Zap, value: '1k+', label: 'Global talent' },
  ]

  return (
    <section className='relative w-full min-h-screen bg-gradient-to-br from-[#7c2a1c]/5 via-white to-[#a0522d]/5 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 pt-16 sm:pt-20 md:pt-24'>

      <div className='absolute inset-0'>
        <div className='absolute inset-0 bg-gradient-to-r from-[#7c2a1c]/5 via-[#a0522d]/5 to-[#8b4513]/5 animate-pulse' />
        <div className='absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(124,42,28,0.05),transparent_50%)]' />
      </div>

      <div className='absolute inset-0 w-full h-full'>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className='w-full h-full'
        >
          <WorldMap dots={connections} lineColor='rgba(124, 42, 28, 0.6)' />
        </motion.div>
      </div>

      <div className='relative z-10 flex items-center justify-center min-h-[calc(100vh-4rem)] sm:min-h-[calc(100vh-5rem)] md:min-h-[calc(100vh-6rem)]'>
        <div className='container px-4 py-8 sm:py-12 md:py-16'>
          <div className='max-w-4xl mx-auto'>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className='bg-white/60 dark:bg-black/30 backdrop-blur-md rounded-2xl shadow-2xl border border-white/40 dark:border-gray-600/40 p-4 sm:p-6 md:p-8 lg:p-10'
            >
              <div className='text-center space-y-4 sm:space-y-6 md:space-y-8'>

                <motion.h1
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className='text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold bg-gradient-to-r from-[#7c2a1c] via-[#c40e12] to-[#c40e12] bg-clip-text text-transparent leading-tight'
                >
                  INTERMEDIANO - Global Talent Platform
                </motion.h1>

                <motion.h2
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                  className='text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold text-gray-700 dark:text-gray-300'
                >
                  Intermediano Recruitment
                </motion.h2>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                  className='max-w-3xl mx-auto'
                >
                  <TextGenerateEffect
                    words={words}
                    className='text-center text-sm sm:text-base md:text-lg lg:text-xl font-medium leading-relaxed text-gray-700 dark:text-gray-300 px-2'
                    duration={0.3}
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                  className='flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center'
                >
                  <button
                    onClick={handleGetStarted}
                    disabled={isLoading}
                    className='w-full sm:w-auto pointer-events-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#7c2a1c] to-[#c40e12] hover:from-[#5d1f15] hover:to-[#8b4513] text-white font-semibold px-6 sm:px-8 md:px-10 py-3 sm:py-4 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed'
                  >
                    Get Started Today
                    <ArrowRight className='ml-2 w-4 h-4 md:w-5 md:h-5' />
                  </button>

                  <Link
                    href='/job-openings'
                    className='w-full sm:w-auto pointer-events-auto inline-flex items-center justify-center gap-2 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold px-6 sm:px-8 md:px-10 py-3 sm:py-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transform hover:scale-105 transition-all duration-200 text-sm sm:text-base'
                  >
                    Browse Opportunities
                  </Link>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1 }}
                className='mt-8 sm:mt-10 md:mt-12 pt-6 sm:pt-8 border-t border-gray-200/60 dark:border-gray-700/60'
              >
                <div className='grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6'>
                  {stats.map((stat, index) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: 1.2 + index * 0.1 }}
                      className='text-center group'
                    >
                      <div className='flex items-center justify-center mb-2 sm:mb-3'>
                        <stat.icon className='w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-primary dark:text-[#a0522d] group-hover:scale-110 transition-transform duration-200' />
                      </div>
                      <div className='text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 dark:text-gray-200 mb-1'>
                        {stat.value}
                      </div>
                      <div className='text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-400 font-medium'>
                        {stat.label}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.5 }}
        className='absolute inset-0 pointer-events-none z-5'
      >
        <div className='absolute top-20 left-10 w-3 h-3 sm:w-4 sm:h-4 bg-[#7c2a1c] rounded-full animate-ping' />
        <div
          className='absolute top-40 right-20 w-2 h-2 sm:w-3 sm:h-3 bg-[#a0522d] rounded-full animate-ping'
          style={{ animationDelay: '0.5s' }}
        />
        <div
          className='absolute bottom-32 left-20 w-2 h-2 bg-[#8b4513] rounded-full animate-ping'
          style={{ animationDelay: '1s' }}
        />
        <div
          className='absolute bottom-20 right-10 w-2 h-2 sm:w-3 sm:h-3 bg-[#5d1f15] rounded-full animate-ping'
          style={{ animationDelay: '1.5s' }}
        />
      </motion.div>
    </section>
  )
}
