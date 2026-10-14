'use client'

import React, { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useApplicantStore } from '@/lib/stores/applicantStore'
import { useDebounce } from '@/lib/debounce'
import { CheckCircle2, Sparkles } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const ProfileSetupInstructionModal = () => {
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const { applicantResumeDetails, tasks } = useApplicantStore()

  const debouncedFileName = useDebounce(applicantResumeDetails?.fileName, 100)

  useEffect(() => {
    setIsOpen(!debouncedFileName)
  }, [debouncedFileName])

  const getStepActionLabel = (completed: boolean) =>
    completed ? t('dashboard.profileSetupInstruction.update') : t('dashboard.profileSetupInstruction.start')

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className='max-w-lg border-border bg-card'>
        <DialogHeader>
          <div className='flex items-center gap-3 mb-2'>
            <div className='w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center'>
              <Sparkles className='w-5 h-5 text-primary' />
            </div>
            <DialogTitle className='text-2xl font-bold text-foreground'>
              {t('dashboard.profileSetupInstruction.title')}
            </DialogTitle>
          </div>
          <DialogDescription className='text-muted-foreground text-base'>
            {t('dashboard.profileSetupInstruction.subtitle')}
          </DialogDescription>
        </DialogHeader>

        <div className='mt-4 space-y-3'>
          {tasks.map((task, idx) => (
            <div
              key={task.id}
              className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                task.completed
                  ? 'bg-muted border-primary/30'
                  : 'bg-card border-border'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center font-medium text-sm ${
                  task.completed
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-foreground text-primary-foreground'
                }`}
              >
                {task.completed ? (
                  <CheckCircle2 className='w-4 h-4' />
                ) : (
                  idx + 1
                )}
              </div>
              <div className='flex-1 min-w-0'>
                <div className='font-medium text-sm text-foreground mb-1'>
                  {task.title.replace(/^Step \d+: /, '')}
                </div>
                <div
                  className={`text-xs ${
                    task.completed
                      ? 'text-primary'
                      : 'text-muted-foreground'
                  }`}
                >
                  {task.completed
                    ? t('dashboard.completed')
                    : t('dashboard.pending')}
                </div>
              </div>

            </div>
          ))}
        </div>

        <div className='mt-6 p-4 rounded-lg bg-muted/50 border border-border'>
          <p className='text-sm text-muted-foreground'>
            {t('dashboard.profileSetupInstruction.footer')}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ProfileSetupInstructionModal
