'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Eye,
  Download,
  Mail,
  Phone,
  MapPin,
  Briefcase
} from 'lucide-react'
import {
  getRankingColor,
  getRankingBadgeVariant,
  formatRankingScore,
  getRankingDescription
} from '../hooks/useApplicantRanking'

interface RankingCriteria {
  skillMatch: number
  experienceLevel: number
  resumeCompleteness: number
  applicationRecency: number
  totalScore: number
}

interface RankedApplicant {
  id: string
  name: string
  email: string | null
  mobile: string
  city: string
  country: string
  avatar?: string
  skills: Array<{ name: string; years: number }>
  resumeFileName?: string
  resumeFileSize?: number
  createdAt: string
  applications: Array<{
    id: string
    jobId: string
    jobTitle: string
    status: string
    appliedAt: string
    lastUpdated: string
    jobLocation?: string
    jobType?: string
    jobIsActive?: boolean
  }>
  ranking: RankingCriteria
  jobMatchScore?: number
}

interface ApplicantRankingCardProps {
  applicant: RankedApplicant
  onViewProfile: (applicant: RankedApplicant) => void
  onDownloadResume: (applicantId: string, fileName: string) => void
  onViewStandardResume?: (applicant: RankedApplicant) => void
  onApplyToJob?: (applicant: RankedApplicant) => void
  showJobMatch?: boolean
}

export function ApplicantRankingCard({
  applicant,
  onViewProfile,
  onDownloadResume,
  onViewStandardResume,
  onApplyToJob,
  showJobMatch = false
}: ApplicantRankingCardProps) {
  const { ranking, jobMatchScore } = applicant

  return (
    <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-gray-300">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={applicant.avatar} />
              <AvatarFallback className="text-lg">
                {applicant.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <CardTitle className="text-xl text-gray-900">{applicant.name}</CardTitle>
              <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <Mail className="h-4 w-4" />
                  <span>{applicant.email}</span>
                </div>
                {applicant.mobile && (
                  <div className="flex items-center space-x-1">
                    <Phone className="h-4 w-4" />
                    <span>{applicant.mobile}</span>
                  </div>
                )}
                {applicant.city && (
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-4 w-4" />
                    <span>{applicant.city}{applicant.country && `, ${applicant.country}`}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="text-right">
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getRankingColor(ranking.totalScore)}`}>
              {formatRankingScore(ranking.totalScore)}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {getRankingDescription(ranking.totalScore)}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">

        {showJobMatch && jobMatchScore !== undefined && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <span className="font-medium text-gray-900">Job Match Score</span>
              </div>
              <Badge variant={getRankingBadgeVariant(jobMatchScore)}>
                {formatRankingScore(jobMatchScore)}
              </Badge>
            </div>
            <Progress value={jobMatchScore} className="h-2" />
            <p className="text-xs text-gray-600 mt-1">
              Skills alignment with job requirements
            </p>
          </div>
        )}

        <div className="space-y-4">
          <div className="flex items-center space-x-2 mb-3">
            <span className="font-medium text-gray-900">Ranking Breakdown</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">Skill Match</span>
                </div>
                <Badge variant={getRankingBadgeVariant(ranking.skillMatch)}>
                  {formatRankingScore(ranking.skillMatch)}
                </Badge>
              </div>
              <Progress value={ranking.skillMatch} className="h-2" />
              <p className="text-xs text-gray-500">Skills vs job requirements</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">Experience</span>
                </div>
                <Badge variant={getRankingBadgeVariant(ranking.experienceLevel)}>
                  {formatRankingScore(ranking.experienceLevel)}
                </Badge>
              </div>
              <Progress value={ranking.experienceLevel} className="h-2" />
              <p className="text-xs text-gray-500">Years of experience</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">Profile Complete</span>
                </div>
                <Badge variant={getRankingBadgeVariant(ranking.resumeCompleteness)}>
                  {formatRankingScore(ranking.resumeCompleteness)}
                </Badge>
              </div>
              <Progress value={ranking.resumeCompleteness} className="h-2" />
              <p className="text-xs text-gray-500">Profile & resume quality</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">Recent Activity</span>
                </div>
                <Badge variant={getRankingBadgeVariant(ranking.applicationRecency)}>
                  {formatRankingScore(ranking.applicationRecency)}
                </Badge>
              </div>
              <Progress value={ranking.applicationRecency} className="h-2" />
              <p className="text-xs text-gray-500">Recent applications (last 30 days)</p>
            </div>
          </div>
        </div>

        {applicant.skills.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="font-medium text-gray-900">Skills & Expertise</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {applicant.skills.map((skill, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {skill.name} ({skill.years}y)
                </Badge>
              ))}
            </div>
          </div>
        )}

        {applicant.applications.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="font-medium text-gray-900">Applications</span>
              <Badge variant="outline">{applicant.applications.length}</Badge>
            </div>
            <div className="text-sm text-gray-600">
              Latest: {applicant.applications[0]?.jobTitle}
              {applicant.applications[0]?.jobLocation && ` • ${applicant.applications[0].jobLocation}`}
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-2 pt-4 border-t">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onViewProfile(applicant)}
            className="flex-1 min-w-0"
          >
            <Eye className="h-4 w-4 mr-2" />
            View Profile
          </Button>

          {onApplyToJob && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onApplyToJob(applicant)}
              className="flex-1 min-w-0"
            >
              <Briefcase className="h-4 w-4 mr-2" />
              Apply to Job
            </Button>
          )}

          {onViewStandardResume && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onViewStandardResume(applicant)}
              className="flex-1 min-w-0"
            >
              Standard Resume
            </Button>
          )}

          {applicant.resumeFileName && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onDownloadResume(applicant.id, applicant.resumeFileName || 'resume')}
              className="flex-1 min-w-0"
            >
              <Download className="h-4 w-4 mr-2" />
              Download Resume
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
