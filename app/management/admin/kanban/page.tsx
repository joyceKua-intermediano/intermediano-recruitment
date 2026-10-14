'use client'

import { KanbanBoard } from '@/features/admin/components/kanban/KanbanBoard'
import { useTranslation } from 'react-i18next'

export default function KanbanPage() {
  const { t } = useTranslation()
  return (
    <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 min-h-[calc(100vh-4rem)] flex flex-col overflow-hidden">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">{t('pages.admin.kanbanTitle')}</h1>
      </div>
      <div className="flex-1 min-h-0">
        <KanbanBoard />
      </div>
    </div>
  )
}