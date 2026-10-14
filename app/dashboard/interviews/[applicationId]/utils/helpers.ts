
export const formatName = (name: string): string => {
  if (!name) return ''
  return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()
}

export const getFirstName = (fullName: string | undefined): string => {
  if (!fullName) return ''
  return formatName(fullName.split(' ')[0])
}
