'use client'

import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import type { KanbanApplication, KanbanColumn } from '../../types/kanban'
import { KANBAN_COLUMN_LABELS, KANBAN_COLUMN_COLORS } from '../../types/kanban'
import { KanbanCard } from './KanbanCard'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

interface KanbanColumnProps {
  columnId: KanbanColumn
  applications: KanbanApplication[]
  onCardClick: (application: KanbanApplication) => void
}

export function KanbanColumn({
  columnId,
  applications,
  onCardClick,
}: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: columnId,
  })

  const cardIds = applications.map((app) => app.id)
  const label = KANBAN_COLUMN_LABELS[columnId]

  const columnColor = KANBAN_COLUMN_COLORS[columnId]

  return (
    <div
      ref={setNodeRef}
      className={`flex-shrink-0 h-full w-72 xl:w-80 ${isOver ? 'bg-blue-50' : ''}`}
    >
      <Card className={`h-full min-h-0 flex flex-col ${columnColor}`}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <h3 className="font-semibold text-gray-900">{label}</h3>
            </div>
            <span className="text-sm text-gray-500 bg-white px-2 py-1 rounded-full">
              {applications.length}
            </span>
          </div>
        </CardHeader>
        <CardContent className="flex-1 min-h-0 overflow-y-auto space-y-3">
          {applications.length === 0 ? (
            <div className="text-center text-gray-400 py-8 text-sm">
              No applications
            </div>
          ) : (
            <SortableContext items={cardIds} strategy={verticalListSortingStrategy}>
              {applications.map((application) => (
                <KanbanCard
                  key={application.id}
                  application={application}
                  onClick={() => onCardClick(application)}
                />
              ))}
            </SortableContext>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
