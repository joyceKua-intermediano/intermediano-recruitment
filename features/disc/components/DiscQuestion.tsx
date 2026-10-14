import React from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, ArrowRight, CheckCircle2, Circle } from 'lucide-react'
import { ADJECTIVES, CATEGORY_INFO, MAX_SELECTIONS } from '../constants/adjectives'
import { COLOR_PRIMARY, COLOR_SECONDARY, COLOR_BG_LIGHT, COLOR_BORDER, COLOR_CARD } from '../constants/colors'
import { getSelectionStatus } from '../services/discCalculations'
import { QuestionProps } from '../types'

export function DiscQuestion({
  questionNumber,
  title,
  description,
  selections,
  isQuestion1,
  onToggleSelection,
  onComplete,
  onBack,
}: QuestionProps) {
  const status = getSelectionStatus(selections.length)

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className='max-w-7xl mx-auto'
    >
      <Card className='shadow-md border-0' style={{ background: COLOR_CARD }}>
        <CardHeader className='border-b' style={{ borderColor: COLOR_BORDER }}>
          <div className='flex items-center justify-between mb-4'>
            <Button
              variant='ghost'
              onClick={onBack}
              className='hover:bg-transparent'
              style={{ color: COLOR_PRIMARY }}
            >
              <ArrowLeft className='mr-2 w-4 h-4' />
              Back
            </Button>
            <div 
              className='text-sm font-medium px-4 py-1.5 rounded-full'
              style={{ background: COLOR_BG_LIGHT, color: COLOR_SECONDARY }}
            >
              Question {questionNumber} of 2
            </div>
          </div>
          <CardTitle className='text-2xl font-bold mb-2' style={{ color: COLOR_PRIMARY }}>
            {title}
          </CardTitle>
          <p className='text-sm leading-relaxed' style={{ color: COLOR_SECONDARY }}>
            {description}
          </p>
        </CardHeader>
        <CardContent className='pt-6'>
          <div 
            className='mb-6 p-4 rounded-lg border' 
            style={{ background: COLOR_BG_LIGHT, borderColor: COLOR_BORDER }}
          >
            <div className='flex items-center justify-between mb-3'>
              <div className='text-sm font-semibold' style={{ color: status.color }}>
                {status.text}
              </div>
              <div className='text-sm font-bold' style={{ color: COLOR_PRIMARY }}>
                {selections.length} / {MAX_SELECTIONS}
              </div>
            </div>
            <div 
              className='w-full h-2 rounded-full overflow-hidden' 
              style={{ background: '#e0d6d1' }}
            >
              <motion.div
                className='h-full rounded-full'
                style={{ background: status.canProceed ? COLOR_PRIMARY : COLOR_SECONDARY }}
                initial={{ width: 0 }}
                animate={{
                  width: `${Math.min((selections.length / MAX_SELECTIONS) * 100, 100)}%`,
                }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          <div className='space-y-6'>
            {Object.entries(CATEGORY_INFO).map(([category, info]) => {
              const categoryAdjectives = ADJECTIVES.filter((adj) => adj.category === category)
              
              return (
                <div key={category}>
                  <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4'>
                    {categoryAdjectives.map((adjective) => {
                      const isSelected = selections.includes(adjective.id)
                      return (
                        <motion.button
                          key={adjective.id}
                          onClick={() => onToggleSelection(adjective.id, isQuestion1)}
                          className='p-3 rounded-lg border transition-all duration-200'
                          style={{
                            borderColor: isSelected ? CATEGORY_INFO.D.color : COLOR_BORDER,
                            background: isSelected ? CATEGORY_INFO.D.lightColor : COLOR_CARD,
                            boxShadow: isSelected ? '0 2px 8px rgba(125, 43, 28, 0.1)' : 'none',
                          }}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className='flex items-start gap-2'>
                            {isSelected ? (
                              <CheckCircle2
                                className='w-5 h-5 flex-shrink-0 mt-0.5'
                                style={{ color: CATEGORY_INFO.D.color }}
                              />
                            ) : (
                              <Circle
                                className='w-5 h-5 flex-shrink-0 mt-0.5'
                                style={{ color: COLOR_BORDER }}
                              />
                            )}
                            <div className='flex-1 min-w-0 text-left'>
                              <div
                                className='text-sm font-medium truncate'
                                style={{ color: COLOR_PRIMARY }}
                              >
                                {adjective.word}
                              </div>
                              <div
                                className='text-xs truncate'
                                style={{ color: COLOR_SECONDARY }}
                              >
                                {adjective.translation}
                              </div>
                            </div>
                          </div>
                        </motion.button>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>

          <div 
            className='flex justify-end mt-8 pt-6 border-t' 
            style={{ borderColor: COLOR_BORDER }}
          >
            <Button
              onClick={onComplete}
              disabled={!status.canProceed}
              size='lg'
              className='px-10 shadow'
              style={{
                background: status.canProceed ? COLOR_PRIMARY : '#d1d5db',
                cursor: status.canProceed ? 'pointer' : 'not-allowed',
                opacity: status.canProceed ? 1 : 0.6,
              }}
            >
              {questionNumber === 1 ? 'Continue to Question 2' : 'View Results'}
              <ArrowRight className='ml-2 w-5 h-5' />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

