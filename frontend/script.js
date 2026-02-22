const API_BASE_URL = "http://localhost:3000/api"

async function submitMetadata (metadata) {
  const response = await fetch(`${API_BASE_URL}/videos`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(metadata),
  })

  if (!response.ok) {
    throw new Error(`Server error: ${response.status} ${response.statusText}`)
  }

  return await response.json()
}

async function uploadFile (file, presignedUrl) {
  const response = await fetch(presignedUrl, {
    method: 'PUT',
    headers: { 'Content-Type': file.type },
    body: file,
  })

  if (!response.ok) {
    throw new Error(`File upload failed: ${response.status} ${response.statusText}`)
  }
}

async function uploadChunk (chunk, presignedUrl) {
  const response = await fetch(presignedUrl, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/octet-stream' },
    body: chunk,
  })

  if (!response.ok) {
    throw new Error(`Chunk upload failed: ${response.status} ${response.statusText}`)
  }
}

function initializeForm () {
  const uploadForm = document.getElementById("upload-form")

  if (!uploadForm) {
    console.error("Upload form not found!")
    return
  }

  uploadForm.addEventListener("submit", async (event) => {
    event.preventDefault()

    const form = event.target
    const statusEl = document.getElementById("status-message")

    // Collect metadata from the form fields
    const metadata = {
      title: form.title.value.trim(),
      description: form.description.value.trim(),
      category: form.category.value,
      tags: form.tags.value
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      video: {
        filename: form.video.files[ 0 ]?.name || "",
        mimeType: form.video.files[ 0 ]?.type || "",
        size: form.video.files[ 0 ]?.size || 0,
      },
      thumbnail: {
        filename: form.thumbnail.files[ 0 ]?.name || "",
        mimeType: form.thumbnail.files[ 0 ]?.type || "",
        size: form.thumbnail.files[ 0 ]?.size || 0,
      },
    }

    try {
      const { video, presignedUrls } = await submitMetadata(metadata)

      // upload thumbnail
      await uploadFile(form.thumbnail.files[ 0 ], presignedUrls.thumbnail.url)

      // upload video in chunks
      const videoFile = form.video.files[ 0 ]
      const chunkSize = 5 * 1024 * 1024 // 5MB
      const totalChunks = Math.ceil(videoFile.size / chunkSize)

      for (let chunkIndex = 1; chunkIndex <= totalChunks; chunkIndex++) {
        const start = (chunkIndex - 1) * chunkSize
        const end = Math.min(start + chunkSize, videoFile.size)
        const chunk = videoFile.slice(start, end)

        let chunkPresignedUrl = presignedUrls.video.url
        if (!(chunkIndex === 1)) {
          const response = await fetch(`${API_BASE_URL}/videos/${video.id}/presign`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              filename: videoFile.name,
              mimeType: videoFile.type,
              uploadId: presignedUrls.video.uploadId,
              partNumber: chunkIndex,
            }),
          })
          if (!response.ok) {
            throw new Error(`Failed to get presigned URL for chunk ${chunkIndex}: ${response.status} ${response.statusText}`)
          }

          const data = await response.json()
          chunkPresignedUrl = data.presignUrl
        }

        await uploadChunk(chunk, chunkPresignedUrl)
      }

      statusEl.textContent = "Video published successfully!"
      statusEl.className = "status-message success"
      // form.reset()
    } catch (error) {
      console.error("Failed to submit metadata:", error)
      statusEl.textContent = "Something went wrong. Please try again."
      statusEl.className = "status-message error"
    }

    return false
  })
}

// Initialize when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeForm)
} else {
  initializeForm()
}
