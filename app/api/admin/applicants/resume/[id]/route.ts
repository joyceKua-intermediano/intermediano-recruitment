import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminAccess } from '@/lib/verifyAdminAccess'
import prisma from '@/lib/prisma'
import { S3Client, GetObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const result = await verifyAdminAccess(request)
    if (!result.success) {
      return NextResponse.json(
        { message: result.error },
        { status: 401 }
      )
    }

    const applicantId = id

    const resumeDetails = await prisma.applicantResumeDetails.findUnique({
      where: { applicantId },
      select: {
        fileName: true,
        fileSize: true,
        applicantId: true
      }
    })

    if (!resumeDetails) {
      return NextResponse.json(
        { message: 'Resume not found' },
        { status: 404 }
      )
    }

    const applicant = await prisma.applicant.findUnique({
      where: { id: resumeDetails.applicantId },
      select: {
        name: true,
        email: true
      }
    })

    const r2Endpoint = process.env.CLOUDFLARER2_ENDPOINT
    const r2AccessKeyId = process.env.CLOUDFLARE_ACCESS_ID
    const r2SecretAccessKey = process.env.CLOUDFLARE_ACCESS_KEY
    const r2BucketName = process.env.CLOUDFLARE_R2_BUCKET_NAME

    if (!r2Endpoint || !r2AccessKeyId || !r2SecretAccessKey || !r2BucketName) {
      if (process.env.NODE_ENV === 'development') {
        console.error('R2 credentials not configured')
      }
      return NextResponse.json(
        { message: 'File storage not configured' },
        { status: 500 }
      )
    }

    const r2Client = new S3Client({
      region: 'auto',
      endpoint: r2Endpoint,
      credentials: {
        accessKeyId: r2AccessKeyId,
        secretAccessKey: r2SecretAccessKey,
      },
    })

    try {
      const getObjectCommand = new GetObjectCommand({
        Bucket: r2BucketName,
        Key: `resumes/${applicantId}`,
      })

      try {
        const listCommand = new ListObjectsV2Command({
          Bucket: r2BucketName,
          MaxKeys: 10
        })
        const listResponse = await r2Client.send(listCommand)
      } catch (listError) {
      }

      const fileResponse = await r2Client.send(getObjectCommand)

      if (!fileResponse.Body) {
        throw new Error('No file body received from R2')
      }

      const chunks = []
      for await (const chunk of fileResponse.Body as any) {
        chunks.push(chunk)
      }
      const fileBuffer = Buffer.concat(chunks)

      const fileExtension = resumeDetails.fileName.split('.').pop()?.toLowerCase()
      let contentType = 'application/octet-stream'

      if (fileExtension === 'pdf') {
        contentType = 'application/pdf'
      } else if (fileExtension === 'txt') {
        contentType = 'text/plain'
      } else if (fileExtension === 'doc') {
        contentType = 'application/msword'
      } else if (fileExtension === 'docx') {
        contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      } else if (fileExtension === 'jpg' || fileExtension === 'jpeg') {
        contentType = 'image/jpeg'
      } else if (fileExtension === 'png') {
        contentType = 'image/png'
      }

      const response = new NextResponse(fileBuffer, {
        status: 200,
        headers: {
          'Content-Type': contentType,
          'Content-Disposition': `inline; filename="${encodeURIComponent(resumeDetails.fileName)}"`,
          'Cache-Control': 'public, max-age=3600',
          'Content-Length': fileBuffer.length.toString(),
        },
      })

      return response

    } catch (r2Error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Error fetching from R2:', r2Error)
      }

      return NextResponse.json(
        {
          message: 'Failed to fetch resume file from storage'
        },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('Error in resume endpoint:', error)

    if (error instanceof Error && process.env.NODE_ENV === 'development') {
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      })
    }
    return NextResponse.json(
      { message: 'Failed to serve resume file' },
      { status: 500 }
    )
  }
}
