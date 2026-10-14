'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Settings } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export default function AdminSettingsPage() {
  const { t } = useTranslation()
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">{t('pages.admin.systemSettingsTitle')}</h1>
        <p className="text-gray-600">{t('pages.admin.systemSettingsSubtitle')}</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="w-5 h-5" />
            <span>{t('pages.admin.systemConfigurationTitle')}</span>
          </CardTitle>
          <CardDescription>
            {t('pages.admin.systemConfigurationDescription')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">{t('pages.admin.settingsComingSoon')}</p>
        </CardContent>
      </Card>
    </div>
  )
} 