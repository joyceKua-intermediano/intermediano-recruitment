'use client'

import React from 'react'
import { CheckCircle2, Circle, User, Briefcase, GraduationCap, Award, Languages, Laptop, FileText } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Section {
  id: string
  label: string
  icon: React.ReactNode
  required?: boolean
}

interface ResumeBuilderNavigationProps {
  sections: Section[]
  activeSection: string
  completedSections: Set<string>
  onSectionClick: (sectionId: string) => void
  progress: number
}

const ResumeBuilderNavigation: React.FC<ResumeBuilderNavigationProps> = ({
  sections,
  activeSection,
  completedSections,
  onSectionClick,
  progress,
}) => {
  return (
    <div className="w-full lg:w-64 shrink-0">
      <div className="sticky top-4 space-y-4">

        <div className="p-4 rounded-lg border border-border bg-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">Progress</span>
            <span className="text-sm font-bold text-primary">{progress}%</span>
          </div>
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-2 bg-primary rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="p-4 rounded-lg border border-border bg-card">
          <h3 className="text-sm font-semibold text-foreground mb-3">Sections</h3>
          <nav className="space-y-1">
            {sections.map((section) => {
              const isCompleted = completedSections.has(section.id)
              const isActive = activeSection === section.id

              return (
                <button
                  key={section.id}
                  onClick={() => onSectionClick(section.id)}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors',
                    'hover:bg-muted',
                    isActive && 'bg-primary/10 text-primary font-medium',
                    !isActive && 'text-muted-foreground'
                  )}
                >
                  <div className="flex-shrink-0">
                    {isCompleted ? (
                      <CheckCircle2 className="w-4 h-4 text-primary" />
                    ) : (
                      <Circle className="w-4 h-4" />
                    )}
                  </div>
                  <div className="flex-shrink-0">{section.icon}</div>
                  <span className="flex-1 text-left">{section.label}</span>
                </button>
              )
            })}
          </nav>
        </div>
      </div>
    </div>
  )
}

export default ResumeBuilderNavigation
