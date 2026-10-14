'use client'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import '../../lib/i18n'

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [isClient, setIsClient] = useState(false)
  const { i18n } = useTranslation()

  useEffect(() => {
    setIsClient(true)

    const savedLanguage = localStorage.getItem('i18nextLng')
    if (savedLanguage && i18n.languages.includes(savedLanguage)) {
      i18n.changeLanguage(savedLanguage)
    } else {
      const browserLang = navigator.language.split('-')[0]
      if (i18n.languages.includes(browserLang)) {
        i18n.changeLanguage(browserLang)
        localStorage.setItem('i18nextLng', browserLang)
      }
    }
  }, [i18n])

  // Prevent hydration mismatch by not rendering until client side
  if (!isClient) {
    return <>{children}</>
  }

  return <>{children}</>
}
