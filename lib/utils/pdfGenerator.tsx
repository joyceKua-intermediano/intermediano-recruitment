import { pdf } from '@react-pdf/renderer'
import ResumePDFDocument from '@/features/applicant/components/ResumePDFDocument'

export const generatePdfFromData = async (
  data: any,
  filename: string = 'resume.pdf'
): Promise<void> => {
  if (typeof window === 'undefined') {
    throw new Error('PDF generation is only available in the browser')
  }

  try {
    const blob = await pdf(<ResumePDFDocument data={data} />).toBlob()
    const url = URL.createObjectURL(blob)

    const link = document.createElement('a')
    link.href = url
    link.download = filename
    link.style.display = 'none'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    setTimeout(() => {
      URL.revokeObjectURL(url)
    }, 100)
  } catch (error) {
    console.error('PDF generation failed:', error)
    throw error
  }
}
