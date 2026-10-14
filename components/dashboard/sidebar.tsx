'use client'
import React, { useState } from 'react'
import { Sidebar, SidebarBody, SidebarLink } from '../ui/sidebar'
import {
  IconArrowLeft,
  IconBrandTabler,
  IconSettings,
  IconUserBolt,
} from '@tabler/icons-react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import Image from 'next/image'

export function SidebarComponent() {
  const links = [
    {
      label: 'Dashboard',
      href: '#',
      icon: (
        <IconBrandTabler className='h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200' />
      ),
    },
    {
      label: 'Profile',
      href: '#',
      icon: (
        <IconUserBolt className='h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200' />
      ),
    },
    {
      label: 'Settings',
      href: '#',
      icon: (
        <IconSettings className='h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200' />
      ),
    },
    {
      label: 'Logout',
      href: '#',
      icon: (
        <IconArrowLeft className='h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200' />
      ),
    },
  ]
  const [open, setOpen] = useState(false)
  return (
    <div
      className={cn(
        'mx-auto flex w-full max-w-full max-h-full flex-1 flex-col overflow-hidden rounded-md border border-neutral-200 bg-gray-100 md:flex-row dark:border-neutral-700 dark:bg-neutral-800',
        'h-[90vh]'
      )}
    >
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className='justify-between gap-10'>
          <div className='flex flex-1 flex-col overflow-x-hidden overflow-y-auto'>
            {open ? <Logo /> : <LogoIcon />}
            <div className='mt-8 flex flex-col gap-2'>
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>
          </div>
          <div>
            <SidebarLink
              link={{
                label: 'Manu Arora',
                href: '#',
                icon: (
                  <Image
                    src='https://assets.aceternity.com/manu.png'
                    className='h-7 w-7 shrink-0 rounded-full'
                    width={50}
                    height={50}
                    alt='Avatar'
                  />
                ),
              }}
            />
          </div>
        </SidebarBody>
      </Sidebar>

      <Dashboard />
    </div>
  )
}
export const Logo = () => {
  return (
    <a
      href='#'
      className='relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black'
    >
      <div className='h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-black dark:bg-white' />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className='font-medium whitespace-pre text-black dark:text-white'
      >
        Intermediano
      </motion.span>
    </a>
  )
}
export const LogoIcon = () => {
  return (
    <a
      href='#'
      className='relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black'
    >
      <div className='h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-black dark:bg-white' />
    </a>
  )
}

const Dashboard = () => {
  const tasks = [
    {
      id: 1,
      title: 'Step 1: Complete Your Basic Information',
      completed: false,
      highlight: true,
    },
    {
      id: 2,
      title: 'Step 2: Showcase Your Skills & Expertise',
      completed: false,
    },
    {
      id: 3,
      title: 'Step 3: Ace the Psychometric Assessment',
      completed: false,
    },
    {
      id: 4,
      title: 'Step 4: Launch Your Profile to the World!',
      completed: false,
    },
  ]
  return (
<div className='flex flex-1'>
  <div className='flex h-full w-full flex-1 flex-col gap-6 rounded-tl-2xl border border-neutral-200 bg-white p-4 md:p-10 dark:border-neutral-700 dark:bg-neutral-900 shadow-md'>
    <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
      {tasks.map((task, idx) => (
        <div
          key={`task-${idx}`}
          className={`flex items-center gap-4 p-4 rounded-lg shadow-sm transition transform hover:scale-105 ${
            idx === 0 && !task.completed
              ? 'bg-yellow-50 border-l-4 border-yellow-400'
              : task.completed
              ? 'bg-green-50 border-l-4 border-green-400'
              : 'bg-gray-50 border-l-4 border-gray-300 dark:bg-neutral-800'
          }`}
        >
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold ${
              task.completed
                ? 'bg-green-400 text-white'
                : idx === 0 && !task.completed
                ? 'bg-yellow-400 text-white'
                : 'bg-gray-300 text-gray-700'
            }`}
          >
            {idx + 1}
          </div>

          <div className='flex-1'>
            <h3 className='text-lg font-semibold text-gray-800 dark:text-gray-200'>
              {task.title}
            </h3>
            {idx === 0 && !task.completed && (
              <p className='text-sm text-yellow-600 dark:text-yellow-400'>

              </p>
            )}
          </div>

          {task.completed && (
            <span className='text-green-500 dark:text-green-400'>✅</span>
          )}
        </div>
      ))}
    </div>

    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
      {[...new Array(2)].map((_, idx) => (
        <div
          key={`placeholder-${idx}`}
          className='h-36 w-full rounded-lg bg-gray-100 dark:bg-neutral-800 animate-pulse'
        ></div>
      ))}
    </div>
  </div>
</div>
  )
}
