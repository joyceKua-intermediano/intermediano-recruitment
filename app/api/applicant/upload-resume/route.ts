import { NextResponse } from 'next/server'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import prisma from '@/lib/prisma'
import { saveResumeDetails } from '@/features/applicant/services/resumeDetails'
import { auth0 } from '@/lib/auth0'

export async function GET(request: Request) {
  const session = await auth0.getSession()
  if (!session?.user?.email) {
    return NextResponse.json(
      { error: 'Unauthorized - Please log in' },
      { status: 401 }
    )
  }

  const { searchParams } = new URL(request.url)
  const applicantId = searchParams.get('applicantId')
  if (!applicantId) {
    return NextResponse.json(
      { error: 'applicantId is required' },
      { status: 400 }
    )
  }

  try {
    const applicant = await prisma.applicant.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    })

    if (!applicant) {
      return NextResponse.json(
        { error: 'Applicant not found' },
        { status: 404 }
      )
    }

    if (applicant.id !== applicantId) {
      return NextResponse.json(
        { error: 'Forbidden - You can only access your own resume details' },
        { status: 403 }
      )
    }

    const getApplicantDetails = await prisma.applicantResumeDetails.findUnique({
      where: {
        applicantId,
      },
    })
    if (!getApplicantDetails) {
      return NextResponse.json([], { status: 200 })
    }
    const resumeDetails = {
      fileName: getApplicantDetails.fileName,
      fileSize: getApplicantDetails.fileSize,
      updatedAt: getApplicantDetails.updatedAt
    }
    return NextResponse.json(resumeDetails)
  } catch (error) {
    console.error('Error fetching applicants:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  const session = await auth0.getSession()
  if (!session?.user?.email) {
    return NextResponse.json(
      { error: 'Unauthorized - Please log in' },
      { status: 401 }
    )
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file');
    const applicantId = formData.get('applicantId');
    const fileName = formData.get('fileName');
    const fileSize = formData.get('fileSize');

    if (!file || !(file instanceof File) || !applicantId || !fileName || !fileSize) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
    const ALLOWED_FILE_TYPES = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
      'text/plain'
    ]
    const ALLOWED_EXTENSIONS = ['.pdf', '.doc', '.docx', '.txt']

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `File size exceeds maximum allowed size of ${MAX_FILE_SIZE / (1024 * 1024)}MB` },
        { status: 400 }
      )
    }

    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only PDF, DOC, DOCX, and TXT files are allowed.' },
        { status: 400 }
      )
    }

    const fileExtension = fileName.toString().toLowerCase().substring(fileName.toString().lastIndexOf('.'))
    if (!ALLOWED_EXTENSIONS.includes(fileExtension)) {
      return NextResponse.json(
        { error: 'Invalid file extension. Only .pdf, .doc, .docx, and .txt files are allowed.' },
        { status: 400 }
      )
    }

    const applicant = await prisma.applicant.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    })

    if (!applicant) {
      return NextResponse.json(
        { error: 'Applicant not found' },
        { status: 404 }
      )
    }

    if (applicant.id !== applicantId.toString()) {
      return NextResponse.json(
        { error: 'Forbidden - You can only upload resumes for your own account' },
        { status: 403 }
      )
    }

    const s3Client = new S3Client({
      region: 'auto',
      endpoint: process.env.CLOUDFLARER2_ENDPOINT,
      credentials: {
        accessKeyId: process.env.CLOUDFLARE_ACCESS_ID!,
        secretAccessKey: process.env.CLOUDFLARE_ACCESS_KEY!,
      },
    });
    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    const key = `resumes/${applicantId}`;
    const command = new PutObjectCommand({
      Bucket: 'intermediano-recruitment',
      Key: key,
      Body: uint8Array,
      ContentType: file.type,
    });
    await s3Client.send(command);

    const resumeDetails = await saveResumeDetails({
      applicantId: applicantId.toString(),
      fileName: fileName.toString(),
      fileSize: parseInt(fileSize.toString(), 10),
    });
    return NextResponse.json(resumeDetails, { status: 201 });
  } catch (error) {
    console.error('Error uploading or saving applicant:', error);
    return NextResponse.json(
      { error: 'Failed to upload file or save data' },
      { status: 500 }
    );
  }
}
