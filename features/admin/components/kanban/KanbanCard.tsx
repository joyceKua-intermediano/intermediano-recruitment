'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { KanbanApplication } from '../../types/kanban'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'
import { User } from 'lucide-react'
import { DiscCardContent } from '@/features/disc/components/DiscCardContent'

interface KanbanCardProps {
  application: KanbanApplication
  onClick: () => void
  isDragging?: boolean
}

export function KanbanCard({
  application,
  onClick,
  isDragging = false,
}: KanbanCardProps) {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({
    id: application.id,
    disabled: isDragging,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isSortableDragging ? 0.5 : 1,
  }

  const handleClick = (e: React.MouseEvent) => {
    if (isSortableDragging) {
      e.preventDefault()
      e.stopPropagation()
      return
    }
    onClick()
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={`cursor-pointer hover:shadow-md transition-shadow ${
        isDragging ? 'shadow-lg' : ''
      }`}
      {...attributes}
      {...listeners}
      onClick={handleClick}
    >
      <CardContent className="p-2 space-y-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            <Avatar className="h-10 w-10 flex-shrink-0">
              <AvatarImage src={application.avatar} alt={application.applicantName} />
              <AvatarFallback>
                {application.avatar ? (
                  <User className="h-5 w-5" />
                ) : (
                  getInitials(application.applicantName)
                )}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm text-gray-900 truncate">
                {application.applicantName}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {application.applicantEmail}
              </p>
            </div>
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold text-gray-800 mb-1">
            {application.jobTitle}
          </p>
        </div>

        {application.discResult && (
          <div className="pt-2 border-t">
            <DiscCardContent
              discResult={application.discResult}
              showLabels={false}
              compact={true}
            />
          </div>
        )}

        {application.interviewScore !== null && application.interviewScore !== undefined && (
          <div className="pt-2 border-t">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-700">Overall Score:</span>
              <div className="flex items-center space-x-1">
                <span className={`text-sm font-bold ${
                  application.interviewScore >= 80 ? 'text-green-600' :
                  application.interviewScore >= 60 ? 'text-yellow-600' :
                  'text-red-600'
                }`}>
                  {Math.round(application.interviewScore)}
                </span>
                <span className="text-xs text-gray-400">/100</span>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-end pt-2 border-t">
          <span className="text-xs text-gray-500">
            {new Date(application.appliedAt).toLocaleDateString()}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
