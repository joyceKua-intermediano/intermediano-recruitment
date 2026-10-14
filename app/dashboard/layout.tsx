'use client'
import React, { useState } from 'react'
import { Sidebar, SidebarBody, SidebarLink } from '../../components/ui/sidebar'
import {
  IconArrowLeft,
  IconBrandTabler,
  IconHome,
  IconBriefcase,
  IconMail,
} from '@tabler/icons-react'
import { cn } from '@/lib/utils'
import { Logo, LogoIcon } from '@/components/Logo'
import Image from 'next/image'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import AvatarDropdown from '@/components/navbar/avatar-dropdown'
import { useUser } from '@auth0/nextjs-auth0'
import { LanguageSwitcher } from '@/components/ui/language-switcher'
import { useTranslation } from 'react-i18next'

export default function Layout({ children }: { children: React.ReactNode }) {
  const { t } = useTranslation()
  const links = [
    {
      label: t('navigation.dashboard'),
      href: '/dashboard',
      icon: (
        <IconBrandTabler className='h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200' />
      ),
    },
    {
      label: t('navigation.logout'),
      icon: (
        <IconArrowLeft className='h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200' />
      ),
      href: '/auth/logout',
    },
  ]

  const landingNavItems = [
    { label: t('navigation.home'), href: '/', icon: <IconHome className='h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200' /> },
    { label: t('navigation.jobOpenings'), href: '/job-openings', icon: <IconBriefcase className='h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200' /> },
    { label: t('navigation.contact'), href: '/contact', icon: <IconMail className='h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200' /> },
  ]

  const [open, setOpen] = useState(false)
  const { user } = useUser();
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div
        className={cn(
          'mx-auto flex w-full max-w-full flex-1 flex-col overflow-hidden rounded-md border border-neutral-200 bg-white/80 backdrop-blur-sm md:flex-row dark:border-neutral-700 dark:bg-neutral-800/80',
          'h-[calc(100vh-2rem)] my-4 mr-4 md:mr-8 lg:mr-16'
        )}
      >
        <Sidebar open={open} setOpen={setOpen}>
          <SidebarBody className='justify-between gap-6 sm:gap-10'>
            <div className='flex flex-1 flex-col overflow-x-hidden overflow-y-auto'>
              <div className="p-4">
                {open ? <Logo /> : <LogoIcon />}
              </div>
              <div className='mt-6 sm:mt-8 flex flex-col gap-2 px-4'>
                {links.map((link, idx) => (
                  <SidebarLink key={idx} link={link} />
                ))}
                <div className='my-4 border-t border-gray-200 dark:border-gray-700'></div>
                {landingNavItems.map((link, idx) => (
                  <SidebarLink key={`landing-${idx}`} link={link} />
                ))}
              </div>
            </div>
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <div className='flex flex-col items-center gap-2'>
                <LanguageSwitcher />
                <AvatarDropdown user={user || undefined} />
                <span className='whitespace-nowrap text-xs font-medium text-neutral-700 dark:text-neutral-200 mt-1'>
                  {user?.name || user?.nickname || t('dashboard.guest')}
                </span>
              </div>
            </div>
          </SidebarBody>
        </Sidebar>
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
