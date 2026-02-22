// ============================================================
// script.js — Mini-YT upload page
// ============================================================

// Base URL for the backend API — change this when deploying to a different environment.
const API_BASE_URL = "http://localhost:3000/api"

/**
 * Sends video metadata to the backend API.
 * Throws an error if the server responds with a non-2xx status.
 * @param {Object} metadata - The metadata object to send.
 */
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
}

/**
 * Handles the upload form submission:
 * 1. Collects metadata fields from the form.
 * 2. Sends metadata via fetch (video upload is left for future implementation).
 */
document.getElementById("upload-form").addEventListener("submit", async (event) => {
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
  }

  // TODO: video file upload — implement when backend endpoint is ready
  // const videoFile = form.video.files[0];
  // const formData = new FormData();
  // formData.append("video", videoFile);
  // await fetch("http://localhost:3000/videos/upload", {
  //   method: "POST",
  //   body: formData,
  // });

  try {
    await submitMetadata(metadata)

    statusEl.textContent = "Video published successfully!"
    statusEl.className = "status-message success"
    form.reset()
  } catch (error) {
    console.error("Failed to submit metadata:", error)
    statusEl.textContent = "Something went wrong. Please try again."
    statusEl.className = "status-message error"
  }
})
