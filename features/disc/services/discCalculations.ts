import { ADJECTIVES, MIN_SELECTIONS, MAX_SELECTIONS } from '../constants/adjectives'
import { TestResults, SelectionStatus } from '../types'

const COLOR_PRIMARY = '#7d2b1c'
const COLOR_SECONDARY = '#a0522d'

export function calculateResults(selections: number[]): TestResults {
  const results: TestResults = { D: 0, I: 0, S: 0, C: 0 }

  selections.forEach((id) => {
    const adjective = ADJECTIVES.find((a) => a.id === id)
    if (adjective) {
      results[adjective.category] += adjective.value
    }
  })

  return results
}

export function getPercentage(value: number, total: number): number {
  return total > 0 ? Math.round((value / total) * 100) : 0
}

export function getDominantProfile(profile: TestResults): keyof TestResults {
  const entries = Object.entries(profile) as [keyof TestResults, number][]
  const dominant = entries.reduce((max, current) =>
    current[1] > max[1] ? current : max
  )
  return dominant[0]
}

export function getSelectionStatus(count: number): SelectionStatus {
  if (count < MIN_SELECTIONS) {
    return {
      text: `Select at least ${MIN_SELECTIONS - count} more adjective${MIN_SELECTIONS - count > 1 ? 's' : ''}`,
      color: COLOR_SECONDARY,
      canProceed: false,
    }
  } else if (count <= MAX_SELECTIONS) {
    return {
      text: `${count} selected • ${MAX_SELECTIONS - count} remaining`,
      color: COLOR_PRIMARY,
      canProceed: true,
    }
  } else {
    return {
      text: `Maximum ${MAX_SELECTIONS} selections reached`,
      color: COLOR_SECONDARY,
      canProceed: false,
    }
  }
}

export function calculateTotalScore(profile: TestResults): number {
  return Object.values(profile).reduce((sum, val) => sum + val, 0)
}
