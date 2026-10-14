import React from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Brain, ArrowRight, FileText } from 'lucide-react'
import { COLOR_PRIMARY, COLOR_SECONDARY, COLOR_BORDER, COLOR_CARD } from '../constants/colors'

interface DiscIntroProps {
  onStart: () => void
}

export function DiscIntro({ onStart }: DiscIntroProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className='max-w-5xl mx-auto'
    >
      <Card className='shadow-md border-0' style={{ background: COLOR_CARD }}>
        <CardHeader className='text-center pb-6'>
          <div className='flex justify-center mb-6'>
            <div
              className='w-16 h-16 rounded-xl flex items-center justify-center shadow'
              style={{ background: COLOR_PRIMARY }}
            >
              <Brain className='w-8 h-8 text-white' />
            </div>
          </div>
          <CardTitle className='text-3xl font-bold mb-3' style={{ color: COLOR_PRIMARY }}>
            DISC Behavioral Assessment
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-8'>
          <div className='space-y-4'>
            <Alert style={{ background: '#fff7f5', border: `1px solid ${COLOR_BORDER}` }}>
              <FileText className='h-5 w-5' style={{ color: COLOR_PRIMARY }} />
              <AlertDescription style={{ color: COLOR_SECONDARY }}>
                <strong style={{ color: COLOR_PRIMARY }}>How it works:</strong> This assessment consists of 2 questions. 
                For each question, you'll select 8-25 adjectives that best describe you. Take your time and answer 
                honestly for the most accurate results.
              </AlertDescription>
            </Alert>
          </div>

          <div className='flex justify-center pt-2'>
            <Button
              onClick={onStart}
              size='lg'
              className='text-base px-10 py-6 shadow'
              style={{ background: COLOR_PRIMARY }}
            >
              Begin Assessment
              <ArrowRight className='ml-2 w-5 h-5' />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

