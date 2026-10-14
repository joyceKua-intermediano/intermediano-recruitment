'use client'

import Link from 'next/link'
import { Mail, Phone, MapPin, Linkedin, Twitter, Facebook } from 'lucide-react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'

export function Footer() {
  const { t } = useTranslation()

  const footerLinks = [
    {
      title: t('footer.aboutTitle'),
      links: [
        { name: t('footer.careers'), href: '/careers' },
      ]
    },
    {
      title: t('footer.resourcesTitle'),
      links: [
        { name: t('footer.privacyPolicy'), href: '/privacy' },
        { name: t('footer.termsOfService'), href: '/terms' },
        { name: t('footer.cookiePolicy'), href: '/cookies' }
      ]
    },
    {
      title: t('footer.employersTitle'),
      links: [
        { name: t('footer.partnerWithUs'), href: '/partner' },
      ]
    }
  ]

  const socialLinks = [
    { icon: <Linkedin size={20} />, href: "https://www.linkedin.com/company/intermediano-inc" },
    { icon: <Twitter size={20} />, href: "https://twitter.com/intermediano" },
    { icon: <Facebook size={20} />, href: "https://www.facebook.com/profile.php?id=61557440275159" }
  ]

  return (
<footer className="bg-[#f5eae0] text-gray-900 pt-16 pb-8">
  <div className="container px-4 mx-auto">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
        <Link href="/" className="flex items-center gap-2 mb-4">
          <span className="font-bold text-2xl bg-gradient-to-r from-primary to-red-600 bg-clip-text text-transparent">
            Intermediano
          </span>
        </Link>
        <p className="mb-6">
          {t('footer.description')}
        </p>
        <div className="flex gap-4">
          {socialLinks.map((social, index) => (
            <motion.a
              key={index}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ y: -2 }}
              className="bg-gray-200 hover:bg-gray-300 p-2 rounded-full transition-colors"
            >
              {social.icon}
            </motion.a>
          ))}
        </div>
      </motion.div>

      {footerLinks.map((column, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          viewport={{ once: true }}
        >
          <h3 className="text-gray-800 font-bold text-lg mb-4">{column.title}</h3>
          <ul className="space-y-3">
            {column.links.map((link, linkIndex) => (
              <li key={linkIndex}>
                <Link
                  href={link.href}
                  className="hover:text-primary transition-colors"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </motion.div>
      ))}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        viewport={{ once: true }}
      >
        <h3 className="text-gray-800 font-bold text-lg mb-4">Contact Us</h3>
        <ul className="space-y-4">
          <li className="flex items-start gap-3">
            <Mail className="w-5 h-5 mt-0.5 text-primary flex-shrink-0" />
            <span>hr@intermediano.com</span>
          </li>
          <li className="flex items-start gap-3">
            <Phone className="w-5 h-5 mt-0.5 text-primary flex-shrink-0" />
            <span>+1 514-907-5393</span>
          </li>
          <li className="flex items-start gap-3">
            <MapPin className="w-5 h-5 mt-0.5 text-primary flex-shrink-0" />
            <span>4388 Rue Saint-Denis Suite 200 #763 Montreal, QC H2J 2L1</span>
          </li>
        </ul>
      </motion.div>
    </div>

    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="border-t border-gray-300 my-8"
    />

    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="flex flex-col md:flex-row justify-between items-center gap-4"
    >
      <p className="text-sm">
        {t('footer.copyright').replace('2024', String(new Date().getFullYear()))}
      </p>
      <div className="flex gap-6">
        <Link href="/privacy" className="text-sm hover:text-primary transition-colors">
          {t('footer.privacyPolicy')}
        </Link>
        <Link href="/terms" className="text-sm hover:text-primary transition-colors">
          {t('footer.termsOfService')}
        </Link>

      </div>
    </motion.div>
  </div>
</footer>

  )
}
