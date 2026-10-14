
export interface UploadVideoOptions {
  applicationId: string
  questionIndex: number
}

export const uploadVideoPerQuestion = async (
  videoBlob: Blob,
  options: UploadVideoOptions
): Promise<void> => {
  const { applicationId, questionIndex } = options

  if (!applicationId) return

  setTimeout(async () => {
    try {
      const urlResponse = await fetch('/api/ai-interview/get-upload-url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          applicationId,
          questionIndex,
        }),
      })

      if (!urlResponse.ok) {
        const errorData = await urlResponse.json().catch(() => ({}))
        console.error(
          `Failed to get upload URL for question ${questionIndex}:`,
          errorData.error || 'Unknown error'
        )
        return
      }

      const urlData = await urlResponse.json()

      if (urlData.skipped) {
        console.warn(`Video upload skipped for question ${questionIndex}: ${urlData.message}`)
        return
      }

      const { uploadUrl, videoId } = urlData

      if (!uploadUrl || !videoId) {
        console.error(`Invalid upload URL response for question ${questionIndex}`)
        return
      }

      const uploadFormData = new FormData()
      uploadFormData.append(
        'file',
        videoBlob,
        `interview-${applicationId}-q${questionIndex}-${Date.now()}.webm`
      )

      const uploadResponse = await fetch(uploadUrl, {
        method: 'POST',
        body: uploadFormData,
      })

      if (!uploadResponse.ok) {
        const errorText = await uploadResponse.text()
        console.error(`Failed to upload video to Cloudflare for question ${questionIndex}:`, errorText)
        return
      }

      const saveResponse = await fetch('/api/ai-interview/upload-video', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          applicationId,
          videoId,
          questionIndex,
        }),
      })

      if (saveResponse.ok) {
        const saveData = await saveResponse.json()
      } else {
        const errorData = await saveResponse.json().catch(() => ({}))
        console.error(`Failed to save videoId for question:`)
      }
    } catch (error) {
      console.error(`Error uploading video for question ${questionIndex}:`, error)
    }
  }, 0)
}
