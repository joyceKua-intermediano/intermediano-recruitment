'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { InterviewResponse } from '../../types/applicant'
import { InterviewVideoPlayer } from './InterviewVideoPlayer'
import { MessageSquare, Video } from 'lucide-react'
import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

interface InterviewResponseCardProps {
  response: InterviewResponse
  questionNumber: number
}

export function InterviewResponseCard({ response, questionNumber }: InterviewResponseCardProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Card className="">
      <CardHeader
        className="cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CardTitle className="text-base font-semibold">
              Question {questionNumber}
              {response.isRetry && (
                <Badge variant="outline" className="ml-2">
                  Retry {response.retryCount}
                </Badge>
              )}
              {response.isFollowUp && (
                <Badge variant="secondary" className="ml-2">
                  Follow-up
                </Badge>
              )}
            </CardTitle>
          </div>
          {isOpen ? (
            <ChevronUp className="h-4 w-4 text-gray-500" />
          ) : (
            <ChevronDown className="h-4 w-4 text-gray-500" />
          )}
        </div>
        <p className="text-sm text-gray-600 mt-2 text-left">
          {response.questionText}
        </p>
      </CardHeader>

      {isOpen && (
        <CardContent className="space-y-4 pt-0">

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-gray-500" />
                <h4 className="text-sm font-semibold text-gray-700">Answer Transcript</h4>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-sm text-gray-800">{response.transcript}</p>
              </div>
            </div>

            {response.videoId ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Video className="h-4 w-4 text-gray-500" />
                  <h4 className="text-sm font-semibold text-gray-700">Video Answer</h4>
                </div>
                <InterviewVideoPlayer
                  videoId={response.videoId}
                  className="w-full h-64"
                />
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <p className="text-sm text-gray-500">No video available for this response</p>
              </div>
            )}

            {response.acknowledgement && (
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-gray-700">Inti Acknowledgement</h4>
                <div className="bg-red-50 rounded-lg p-3">
                  <p className="text-sm text-gray-800">{response.acknowledgement}</p>
                </div>
              </div>
            )}

            {response.score !== null && response.score !== undefined && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-gray-700">Inti Analysis</h4>
                  <div className="flex items-center space-x-1">
                    <span className={`text-sm font-bold ${
                      response.score >= 80 ? 'text-green-600' :
                      response.score >= 60 ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>
                      Score: {response.score}
                    </span>
                    <span className="text-xs text-gray-400">/100</span>
                  </div>
                </div>
                {response.analysis && (
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <p className="text-sm text-gray-800 whitespace-pre-wrap">{response.analysis}</p>
                  </div>
                )}
              </div>
            )}

          <div className="text-xs text-gray-500 pt-2 border-t">
            Answered: {new Date(response.answeredAt).toLocaleString()}
          </div>
        </CardContent>
      )}
    </Card>
  )
}
