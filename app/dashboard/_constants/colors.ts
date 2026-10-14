export const STATUS_CLASSES = {
  APPLIED: {
    bg: 'bg-blue-50 dark:bg-blue-950/20',
    text: 'text-blue-700 dark:text-blue-300',
    border: 'border-blue-200 dark:border-blue-800',
  },
  REVIEWING: {
    bg: 'bg-amber-50 dark:bg-amber-950/20',
    text: 'text-amber-700 dark:text-amber-300',
    border: 'border-amber-200 dark:border-amber-800',
  },
  INTERVIEW: {
    bg: 'bg-green-50 dark:bg-green-950/20',
    text: 'text-green-700 dark:text-green-300',
    border: 'border-green-200 dark:border-green-800',
  },
  ACCEPTED: {
    bg: 'bg-green-50 dark:bg-green-950/20',
    text: 'text-green-700 dark:text-green-300',
    border: 'border-green-200 dark:border-green-800',
  },
  REJECTED: {
    bg: 'bg-red-50 dark:bg-red-950/20',
    text: 'text-red-700 dark:text-red-300',
    border: 'border-red-200 dark:border-red-800',
  },
  DEFAULT: {
    bg: 'bg-muted',
    text: 'text-muted-foreground',
    border: 'border-border',
  },
} as const

export const getStatusClasses = (status: string) => {
  const statusKey = status.toUpperCase() as keyof typeof STATUS_CLASSES
  return STATUS_CLASSES[statusKey] || STATUS_CLASSES.DEFAULT
}
