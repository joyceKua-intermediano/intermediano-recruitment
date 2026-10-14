import { NextRequest, NextResponse } from 'next/server'
import { auth0 } from '@/lib/auth0'

export async function POST(request: NextRequest) {
  try {
    const session = await auth0.getSession()
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized - Please log in' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { applicationId, questionIndex } = body

    if (!applicationId) {
      return NextResponse.json(
        { error: 'No application ID provided' },
        { status: 400 }
      )
    }

    const cloudflareAccountId = process.env.CLOUDFLARE_ACCOUNT_ID
    const cloudflareApiToken = process.env.CLOUDFLARE_STREAM_API_TOKEN

    if (!cloudflareAccountId || !cloudflareApiToken) {
      return NextResponse.json({
        success: false,
        skipped: true,
        message: 'Cloudflare Stream not configured',
      })
    }

    const directUploadResponse = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${cloudflareAccountId}/stream/direct_upload`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${cloudflareApiToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          maxDurationSeconds: 300 ,
          metadata: {
            applicationId,
            questionIndex: questionIndex !== undefined ? questionIndex.toString() : undefined,
          },
        }),
      }
    )

    if (!directUploadResponse.ok) {
      const errorText = await directUploadResponse.text()
      console.error('Cloudflare direct upload URL error:', errorText)
      return NextResponse.json(
        { error: 'Failed to get direct upload URL from Cloudflare' },
        { status: 500 }
      )
    }

    const uploadData = await directUploadResponse.json()
    const uploadUrl = uploadData.result?.uploadURL
    const videoId = uploadData.result?.uid

    if (!uploadUrl || !videoId) {
      console.error('No upload URL or video ID in Cloudflare response:', uploadData)
      return NextResponse.json(
        { error: 'Failed to get upload URL from Cloudflare' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      uploadUrl,
      videoId,
    })
  } catch (error) {
    console.error('Error getting direct upload URL:', error)
    return NextResponse.json(
      { error: 'Failed to get upload URL' },
      { status: 500 }
    )
  }
}
