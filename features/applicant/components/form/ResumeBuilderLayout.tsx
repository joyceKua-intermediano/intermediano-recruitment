'use client'
import React, { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Eye, EyeOff, Save, CheckCircle2, FileText } from 'lucide-react'
import { toast } from 'sonner'
import ResumeBuilder from './ResumeBuilder'
import ResumePreview from './ResumePreview'
import { ResumeBuilderFormSchemaType } from '../../schemas/resumeBuilderSchema'

interface ResumeBuilderLayoutProps {
  onSubmitSuccess?: () => void
  onNext?: () => void
}

const ResumeBuilderLayout: React.FC<ResumeBuilderLayoutProps> = ({ onSubmitSuccess, onNext }) => {
  const [formData, setFormData] = useState<ResumeBuilderFormSchemaType | null>(null)
  const resumeRef = useRef<HTMLDivElement>(null)
  const [showPreview, setShowPreview] = useState(true)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [isAutoSaving, setIsAutoSaving] = useState(false)

  const handleFormDataChange = (data: ResumeBuilderFormSchemaType) => {
    setFormData(data)
    setIsAutoSaving(true)
    setTimeout(() => {
      setIsAutoSaving(false)
      setLastSaved(new Date())
    }, 500)
  }

  return (
    <div className="w-full space-y-6">

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Resume Builder</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Create a professional resume with real-time preview
          </p>
        </div>
        <div className="flex items-center gap-3">

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            {isAutoSaving ? (
              <>
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                <span>Saving...</span>
              </>
            ) : lastSaved ? (
              <>
                <CheckCircle2 className="w-3 h-3 text-primary" />
                <span>
                  Saved {lastSaved.toLocaleDateString(undefined, {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>              </>
            ) : null}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowPreview(!showPreview)}
            className="xl:hidden"
          >
            {showPreview ? (
              <>
                <EyeOff className="w-4 h-4 mr-2" />
                Hide CV Preview
              </>
            ) : (
              <>
                <Eye className="w-4 h-4 mr-2" />
                Show CV Preview
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className={showPreview ? 'xl:block' : 'block'}
        >
          <Card className="border border-border bg-card">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Save className="w-5 h-5 text-primary" />
                Resume Information
              </CardTitle>
              <p className="text-xs text-muted-foreground mt-1">
                Fill in your details below. Changes are saved automatically.
              </p>
            </CardHeader>
            <CardContent>
              <ResumeBuilder
                onSubmitSuccess={onSubmitSuccess}
                onNext={onNext}
                onFormDataChange={handleFormDataChange}
              />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className={`${showPreview ? 'block' : 'hidden'} xl:block`}
        >
          <Card className="border border-border bg-card sticky top-4">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <Eye className="w-5 h-5 text-primary" />
                  Resume Preview
                </CardTitle>
                <div className="text-xs text-muted-foreground">
                  Live Preview
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div ref={resumeRef} className="max-h-[80vh] overflow-y-auto">
                {formData ? (
                  <ResumePreview data={formData} />
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <FileText className="w-12 h-12 text-muted-foreground mb-4" />
                    <p className="text-sm font-medium text-foreground mb-1">
                      No data yet
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Start filling in the form to see your resume preview
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

export default ResumeBuilderLayout
