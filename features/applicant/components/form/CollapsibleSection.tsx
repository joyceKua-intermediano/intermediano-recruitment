'use client'

import React, { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface CollapsibleSectionProps {
  id: string
  title: string
  icon: React.ReactNode
  defaultOpen?: boolean
  children: React.ReactNode
  completed?: boolean
  required?: boolean
}

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
  id,
  title,
  icon,
  defaultOpen = true,
  children,
  completed = false,
  required = false,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <Card className={cn(
      'border transition-all',
      completed ? 'border-primary/30 bg-muted/30' : 'border-border bg-card',
      isOpen && 'shadow-sm'
    )}>
      <CardHeader
        className="cursor-pointer hover:bg-muted/50 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-3 text-base font-semibold">
            <div className={cn(
              'flex items-center justify-center w-8 h-8 rounded-lg',
              completed ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
            )}>
              {icon}
            </div>
            <span className="text-foreground">{title}</span>
            {required && !completed && (
              <span className="text-xs text-destructive ml-2">*</span>
            )}
          </CardTitle>
          <div className="flex items-center gap-2">
            {completed && (
              <span className="text-xs text-primary font-medium">Completed</span>
            )}
            {isOpen ? (
              <ChevronUp className="w-4 h-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            )}
          </div>
        </div>
      </CardHeader>
      {isOpen && (
        <CardContent className="pt-4">
          {children}
        </CardContent>
      )}
    </Card>
  )
}

export default CollapsibleSection

