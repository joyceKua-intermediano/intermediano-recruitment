import { motion } from 'framer-motion'
import Link from 'next/link'

export const Logo = () => {
  const spring = {
    type: 'spring',
    stiffness: 700,
    damping: 30,
  } as const
  return (
    <Link href='/' className='flex items-center gap-2' aria-label='Home'>
      <motion.span
        whileHover={{
          scale: 1.05,
          textShadow: '0 0 8px rgba(239, 68, 68, 0.6)',
        }}
        whileTap={{ scale: 0.95 }}
        transition={spring}
        className='font-bold text-2xl bg-gradient-to-r from-primary to-red-600 bg-clip-text text-transparent'
      >
        Intermediano
      </motion.span>
    </Link>
  )
}

export const LogoIcon = () => {
  return (
    <Link
      href='/'
      className='relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black'
    >
      <div className='h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-black dark:bg-white' />
    </Link>
  )
}
