export interface ApplicantsStatsSchema {
  total: number
  totalMonth: number
  changeFromLastMonth: number
}

export interface JobsStatsSchema {
  total: number
  totalMonth: number
  changeFromLastMonth: number
}

export interface ApplicationsStatsSchema {
  total: number
  totalMonth: number
  changeFromLastMonth: number
}

export interface HireRateStatsSchema {
  total: number
  totalMonth: number
  changeFromLastMonth: number
}

export interface ApplicantsListSchema {
  applicants: Array<{
    id: string
    name: string
    email: string
    createdAt: string
  }>
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}
