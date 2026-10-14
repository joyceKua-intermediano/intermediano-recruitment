export type IntiLanguage = 'en' | 'pt' | 'es'

export const INTI_LANGUAGES = ['en', 'pt', 'es'] as const

export function parseIntiLanguage(value: unknown): IntiLanguage {
  if (value === 'pt' || value === 'es') return value
  return 'en'
}
