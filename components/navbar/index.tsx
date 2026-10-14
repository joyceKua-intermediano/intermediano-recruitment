'use client'
import MotionHeader from './MotionHeader'
import NavbarLinks from './NavbarLinks'
import ResponsiveNavbar from './ResponsiveNavbar'
import { usePathname } from 'next/navigation'
import { useUser } from '@auth0/nextjs-auth0'

export function Navbar() {
  const pathname = usePathname()
  const { user, isLoading } = useUser()
  const navItems = [
    { name: 'home', href: '/' },
    { name: 'jobOpenings', href: '/job-openings' },
    { name: 'partnerWithUs', href: '/partner' },
    { name: 'contact', href: '/contact' },
  ]
  const handleJobOpeningsClick = (e: React.MouseEvent, href: string) => {
    if (pathname === '/' && href === '#job-openings') {
      e.preventDefault()
      const element = document.getElementById('job-openings')
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }
  const showBurger = pathname.startsWith('/dashboard') || pathname.startsWith('/management/admin')

  return (
    !showBurger && (
      <MotionHeader>
        <div className='container z-0 flex h-16 items-center justify-between px-4'>
          <NavbarLinks
            navItems={navItems}
            onJobOpeningsClick={handleJobOpeningsClick}
          />
          <ResponsiveNavbar
            navItems={navItems}
            onJobOpeningsClick={handleJobOpeningsClick}
          />
        </div>
      </MotionHeader>
    )
  )
}
