'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'

export function TeamSection() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const team = [
    {
      name: 'FERNANDO GUTIÉRREZ',
      role: 'CEO & Founder',
      bio: 'Fernando Gutierrez has developed his international experience both in Latin America and North America working for more than twenty years in the HR field.',
      image: '/fernando.jpg',
    },
    {
      name: 'JENNIFFER CASANOVA',
      role: 'REGIONAL MANAGER',
      bio: 'worked for more than fourteen years as an International Financial Auditor and Accountant, as well as in the Management and Coordination of the areas of Human Resources and Payroll in different sectors of the economy',
      image: '/jenniffer.jpg',
    },
    {
      name: 'YULIE REY',
      role: 'COORDINATION',
      bio: '7 years of experience in the Human Resources and Payroll sector.',
      image: '/yulie.jpg',
    },
    {
      name: 'KENDRICK LIWANAG',
      role: 'MANAGING DIRECTOR - ASIA',
      bio: ' 15 years of Human Resources experience, with a strong focus on APAC Recruitment, Talent Development, Compliance, and Employee Engagement.',
      image: '/ken.png',
    },
  ]

  if (!isMounted) {
    return (
      <section className='py-20 bg-white dark:bg-black'>
        <div className='container px-4 mx-auto'>
          <div className='text-center mb-16'>
            <h2 className='text-3xl font-bold mb-4'>Meet Our Team</h2>
            <p className='text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto'>
              The passionate people behind Intermediano
            </p>
          </div>
          <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-8'>
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className='animate-pulse'>
                <div className='aspect-square bg-gray-200 dark:bg-gray-700 rounded-xl mb-4'></div>
                <div className='h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2'></div>
                <div className='h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2'></div>
                <div className='h-3 bg-gray-200 dark:bg-gray-700 rounded w-full'></div>
                <div className='h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6 mt-2'></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className='py-20 bg-white dark:bg-black'>
      <div className='container px-4 mx-auto'>
        <div className='text-center mb-16'>
          <h2 className='text-3xl font-bold mb-4'>Meet Our Team</h2>
          <p className='text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto'>
            The passionate people behind Intermediano
          </p>
        </div>

        <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-8'>
          {team.map((member, index) => (
            <div key={index} className='group'>
              <div className='relative aspect-square mb-4 rounded-xl overflow-hidden'>
                <Image
                  src={member.image}
                  alt={member.name}
                  width={400}
                  height={400}
                  className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-300'
                  priority={index < 2}
                />
                <div className='absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6'>
                  <div>
                    <h3 className='text-white text-xl font-bold'>
                      {member.name}
                    </h3>
                    <p className='text-white'>{member.role}</p>
                  </div>
                </div>
              </div>
              <p className='text-gray-600 dark:text-gray-300'>{member.bio}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
