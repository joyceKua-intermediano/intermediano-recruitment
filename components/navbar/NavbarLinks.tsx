'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'

interface Items {
  name: string
  href: string
}

interface NavbarLinksProps {
  navItems: Items[]
  onJobOpeningsClick: (e: React.MouseEvent, href: string) => void
}

const NavLink = ({
  href,
  children,
  onJobOpeningsClick
}: {
  href: string
  children: React.ReactNode
  onJobOpeningsClick?: (e: React.MouseEvent, href: string) => void
}) => {
  return (
    <Link
      href={href}
      onClick={(e) => {
        if (href === '#job-openings' && onJobOpeningsClick) {
          onJobOpeningsClick(e, href)
        }
      }}
      className='relative text-md font-medium transition-colors hover:text-primary group'
    >
      <motion.span
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className='block py-2'
      >
        {children}
        <motion.span
          className='absolute left-0 bottom-0 w-0 h-0.5 bg-primary'
          initial={{ width: 0 }}
          whileHover={{ width: '100%' }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        />

        <motion.span
          className='absolute inset-0 opacity-0 bg-primary/10 rounded-md'
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        />
      </motion.span>
    </Link>
  )
}

const NavbarLinks: React.FC<NavbarLinksProps> = ({ navItems, onJobOpeningsClick }) => {
  const spring = {
    type: 'spring',
    stiffness: 700,
    damping: 30,
  } as const

  const { t } = useTranslation()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  return (
    <div className='flex items-center gap-10'>
      <Link href='/' className='flex items-center gap-2' aria-label='Home'>
        <motion.div
          whileHover={{
            scale: 1.05,
            textShadow: '0 0 8px rgba(239, 68, 68, 0.6)'
          }}
          whileTap={{ scale: 0.95 }}
          transition={spring}
          className='font-bold text-2xl bg-gradient-to-r from-primary to-red-600 bg-clip-text text-transparent'
        >
          Intermediano
        </motion.div>
      </Link>

      <nav className='hidden md:flex items-center gap-6'>
        <AnimatePresence>
          {navItems.map((item, index) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: index * 0.6,
                type: 'spring',
                stiffness: 300
              }}
            >
              <NavLink
                href={item.href}
                onJobOpeningsClick={item.href === '#job-openings' ? onJobOpeningsClick : undefined}
              >
                {isClient ? t(`navigation.${item.name}`) : item.name}
              </NavLink>
            </motion.div>
          ))}
        </AnimatePresence>
      </nav>
    </div>
  )
}

export default NavbarLinks
