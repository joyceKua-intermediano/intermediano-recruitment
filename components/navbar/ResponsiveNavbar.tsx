'use client'
import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Menu, X, LayoutDashboard } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useUser } from '@auth0/nextjs-auth0'
import AvatarDropdown from './avatar-dropdown'
import { usePathname } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { LanguageSwitcher } from '@/components/ui/language-switcher'

type NavItem = {
  name: string
  href: string
}

type ResponsiveNavbarProps = {
  navItems: NavItem[]
  onJobOpeningsClick: (e: React.MouseEvent, href: string) => void
}

const ResponsiveNavbar: React.FC<ResponsiveNavbarProps> = ({
  navItems,
  onJobOpeningsClick,
}) => {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const { user } = useUser()
  const pathname = usePathname()
  const { t } = useTranslation()

  useEffect(() => {
    setIsClient(true)
  }, [])

  const showBurger = !pathname.startsWith('/dashboard')

  return (
    <div className='flex items-center gap-4'>
      <div className='hidden md:flex items-center gap-4'>
        <LanguageSwitcher />
        {user ? (
          <>
            <Link href="/dashboard">
              <LayoutDashboard className="cursor-pointer" />
            </Link>
            <AvatarDropdown user={user} />
          </>

        ) : (
          <>
            <a
              href='/auth/login?screen_hint=signup'
              className='text-sm font-medium transition-colors hover:text-primary cursor-pointer pointer-events-auto  transform hover:scale-105'
            >
              {isClient ? t('navigation.signUp') : 'Sign up'}
            </a>
            <a
              href='/auth/login'
              className='px-4 py-2 rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors cursor-pointer  transform hover:scale-105'
            >
              {isClient ? t('navigation.logIn') : 'Log in'}
            </a>
          </>
        )}
      </div>
      {showBurger && (
        <>
          <Button
            variant='ghost'
            size='icon'
            className='md:hidden'
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </Button>

          <motion.div
            initial={false}
            animate={mobileOpen ? 'open' : 'closed'}
            className='md:hidden fixed inset-0 top-16 z-50'
            style={{ pointerEvents: mobileOpen ? 'auto' : 'none' }}
          >
            <motion.div
              variants={{
                open: { opacity: 1, y: 0 },
                closed: { opacity: 0, y: -20 },
              }}
              transition={{ duration: 0.2 }}
              className='absolute left-0 right-0 bg-background shadow-lg border-t'
            >
              <div className='container px-4 py-4 flex flex-col gap-2'>
                <div className='flex justify-end mb-2'>
                  <LanguageSwitcher />
                </div>
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className='py-3 px-2 text-sm font-medium transition-colors hover:text-primary rounded-md hover:bg-accent'
                    onClick={(e) => {
                      if (item.href === '#job-openings') {
                        onJobOpeningsClick(e, item.href)
                      }
                      setMobileOpen(false)
                    }}
                  >
                    {isClient ? t(`navigation.${item.name}`) : item.name}
                  </Link>
                ))}
                {user && (
                  <Link
                    href='/dashboard'
                    className='py-3 px-2 text-sm font-medium transition-colors hover:text-primary rounded-md hover:bg-accent'
                    onClick={() => setMobileOpen(false)}
                  >
                    {isClient ? t('navigation.dashboard') : 'Dashboard'}
                  </Link>
                )}
                <div className='flex flex-col gap-2 pt-4 mt-2 border-t'>
                  {user ? (
                    <Link
                      href='/auth/logout'
                      className='py-3 px-2 text-sm font-medium transition-colors hover:text-primary rounded-md hover:bg-accent'
                      onClick={() => setMobileOpen(false)}
                    >
                      {isClient ? t('navigation.logout') : 'Log out'}
                    </Link>
                  ) : (
                    <>
                      <Link
                        href='/auth/login?screen_hint=signup'
                        className='py-3 px-2 text-sm font-medium transition-colors hover:text-primary rounded-md hover:bg-accent'
                        onClick={() => setMobileOpen(false)}
                      >
                        {isClient ? t('navigation.signUp') : 'Sign up'}
                      </Link>
                      <Link
                        href='/auth/login'
                        className='py-3 px-2 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 rounded-md transition-colors text-center'
                        onClick={() => setMobileOpen(false)}
                      >
                        {isClient ? t('navigation.logIn') : 'Log in'}
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
            <motion.div
              variants={{
                open: { opacity: 1 },
                closed: { opacity: 0 },
              }}
              className='fixed inset-0 bg-black/50 backdrop-blur-sm'
              onClick={() => setMobileOpen(false)}
            />
          </motion.div>
        </>
      )}
    </div>
  )
}

export default ResponsiveNavbar
