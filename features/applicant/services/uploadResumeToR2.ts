import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { saveResumeDetails } from '@/features/applicant/services/resumeDetails'

const MAX_FILE_SIZE = 10 * 1024 * 1024
const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
]
const ALLOWED_EXTENSIONS = ['.pdf', '.doc', '.docx', '.txt']

export function validateResumeFile(
  file: File,
  fileName: string
): { ok: true } | { ok: false; message: string } {
  if (file.size > MAX_FILE_SIZE) {
    return {
      ok: false,
      message: `File size exceeds maximum allowed size of ${MAX_FILE_SIZE / (1024 * 1024)}MB`,
    }
  }

  if (file.type && !ALLOWED_FILE_TYPES.includes(file.type)) {
    return {
      ok: false,
      message: 'Invalid file type. Only PDF, DOC, DOCX, and TXT files are allowed.',
    }
  }

  const fileExtension = fileName
    .toLowerCase()
    .substring(fileName.lastIndexOf('.'))
  if (!ALLOWED_EXTENSIONS.includes(fileExtension)) {
    return {
      ok: false,
      message: 'Invalid file extension. Only .pdf, .doc, .docx, and .txt files are allowed.',
    }
  }

  return { ok: true }
}

export async function uploadApplicantResume(params: {
  applicantId: string
  file: File
  fileName: string
  fileSize: number
}) {
  const s3Client = new S3Client({
    region: 'auto',
    endpoint: process.env.CLOUDFLARER2_ENDPOINT,
    credentials: {
      accessKeyId: process.env.CLOUDFLARE_ACCESS_ID!,
      secretAccessKey: process.env.CLOUDFLARE_ACCESS_KEY!,
    },
  })

  const arrayBuffer = await params.file.arrayBuffer()
  const uint8Array = new Uint8Array(arrayBuffer)
  const command = new PutObjectCommand({
    Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME || 'intermediano-recruitment',
    Key: `resumes/${params.applicantId}`,
    Body: uint8Array,
    ContentType: params.file.type || 'application/octet-stream',
  })

  await s3Client.send(command)

  return saveResumeDetails({
    applicantId: params.applicantId,
    fileName: params.fileName,
    fileSize: params.fileSize,
  })
}
