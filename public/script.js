class StreamManager {
  constructor() {
    this.streams = []
    this.currentLayout = "grid-2x2"
    this.init()
  }

  init() {
    this.bindEvents()
    this.loadStreams()
  }

  bindEvents() {
    // Refresh button
    document.getElementById("refreshBtn").addEventListener("click", () => {
      this.loadStreams()
    })

    // Add stream button
    document.getElementById("addStreamBtn").addEventListener("click", () => {
      this.showAddStreamModal()
    })

    // Layout selector
    document.getElementById("layoutSelect").addEventListener("change", (e) => {
      this.changeLayout(e.target.value)
    })

    // Modal events
    document.getElementById("addStreamForm").addEventListener("submit", (e) => {
      e.preventDefault()
      this.addStream()
    })

    document.getElementById("cancelBtn").addEventListener("click", () => {
      this.hideAddStreamModal()
    })

    document.querySelector(".close").addEventListener("click", () => {
      this.hideAddStreamModal()
    })

    // Close modal when clicking outside
    window.addEventListener("click", (e) => {
      const modal = document.getElementById("addStreamModal")
      if (e.target === modal) {
        this.hideAddStreamModal()
      }
    })
  }

  async loadStreams() {
    try {
      this.showLoading()
      const response = await fetch("/api/streams")
      const data = await response.json()

      if (data.success) {
        this.streams = data.streams
        this.renderStreams()
      } else {
        this.showError("Failed to load streams")
      }
    } catch (error) {
      console.error("Error loading streams:", error)
      this.showError("Failed to connect to server")
    }
  }

  renderStreams() {
    const container = document.getElementById("streamContainer")
    container.innerHTML = ""
    container.className = `stream-container ${this.currentLayout}`

    if (this.streams.length === 0) {
      container.innerHTML =
        '<div class="loading">No streams available. Add some streams to get started!</div>'
      return
    }

    this.streams.forEach((stream) => {
      const streamElement = this.createStreamElement(stream)
      container.appendChild(streamElement)
    })
  }

  createStreamElement(stream) {
    const streamDiv = document.createElement("div")
    streamDiv.className = "stream-frame"
    streamDiv.innerHTML = `
            <div class="stream-header">
                <span class="stream-title">${this.escapeHtml(
                  stream.title
                )}</span>
                <button class="remove-btn" onclick="streamManager.removeStream(${
                  stream.id
                })" title="Remove stream">×</button>
            </div>
            <iframe 
                class="stream-iframe" 
                src="${this.escapeHtml(stream.url)}" 
                frameborder="0" 
                allowfullscreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                loading="lazy">
            </iframe>
        `
    return streamDiv
  }

  async addStream() {
    const title = document.getElementById("streamTitle").value.trim()
    let url = document.getElementById("streamUrl").value.trim()
    const type = document.getElementById("streamType").value

    if (!title || !url) {
      alert("Please fill in all required fields")
      return
    }

    // Auto-detect YouTube URLs and set type accordingly
    let detectedType = type
    if (type === "custom") {
      if (url.includes("youtube.com") || url.includes("youtu.be")) {
        detectedType = "youtube"
      } else if (url.includes("twitch.tv")) {
        detectedType = "twitch"
      }
    }

    // Process the URL on the frontend as well for immediate feedback
    if (detectedType === "youtube") {
      url = StreamUtils.processYouTubeUrl(url)
    } else if (detectedType === "twitch") {
      url = StreamUtils.processTwitchUrl(url)
    }

    try {
      const response = await fetch("/api/streams", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, url, type: detectedType }),
      })

      const data = await response.json()

      if (data.success) {
        this.hideAddStreamModal()
        this.loadStreams() // Refresh the stream list
        this.clearForm()
      } else {
        alert(data.message || "Failed to add stream")
      }
    } catch (error) {
      console.error("Error adding stream:", error)
      alert("Failed to add stream")
    }
  }

  async removeStream(streamId) {
    if (!confirm("Are you sure you want to remove this stream?")) {
      return
    }

    try {
      console.log("Attempting to remove stream with ID:", streamId)
      const response = await fetch(`/api/streams/${streamId}`, {
        method: "DELETE",
      })

      console.log("Response status:", response.status)
      const data = await response.json()
      console.log("Response data:", data)

      if (data.success) {
        this.loadStreams() // Refresh the stream list
      } else {
        alert(data.message || "Failed to remove stream")
      }
    } catch (error) {
      console.error("Error removing stream:", error)
      alert("Failed to remove stream: " + error.message)
    }
  }

  changeLayout(layout) {
    this.currentLayout = layout
    const container = document.getElementById("streamContainer")
    container.className = `stream-container ${layout}`
  }

  showAddStreamModal() {
    document.getElementById("addStreamModal").style.display = "block"
    document.getElementById("streamTitle").focus()
  }

  hideAddStreamModal() {
    document.getElementById("addStreamModal").style.display = "none"
  }

  clearForm() {
    document.getElementById("addStreamForm").reset()
  }

  showLoading() {
    const container = document.getElementById("streamContainer")
    container.innerHTML = '<div class="loading">Loading streams...</div>'
  }

  showError(message) {
    const container = document.getElementById("streamContainer")
    container.innerHTML = `<div class="error-message">${this.escapeHtml(
      message
    )}</div>`
  }

  escapeHtml(text) {
    const map = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;",
    }
    return text.replace(/[&<>"']/g, function (m) {
      return map[m]
    })
  }
}

// Utility functions for URL processing
const StreamUtils = {
  // Convert YouTube watch URLs to embed URLs
  processYouTubeUrl(url) {
    const regex =
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/
    const match = url.match(regex)
    if (match) {
      return `https://www.youtube.com/embed/${match[1]}`
    }
    return url
  },

  // Convert Twitch URLs to embed URLs
  processTwitchUrl(url) {
    const regex = /twitch\.tv\/([^\/\n?#]+)/
    const match = url.match(regex)
    if (match) {
      return `https://player.twitch.tv/?channel=${match[1]}&parent=${window.location.hostname}`
    }
    return url
  },

  // Process URL based on type
  processStreamUrl(url, type) {
    switch (type) {
      case "youtube":
        return this.processYouTubeUrl(url)
      case "twitch":
        return this.processTwitchUrl(url)
      default:
        return url
    }
  },
}

// Initialize the stream manager when the page loads
let streamManager
document.addEventListener("DOMContentLoaded", () => {
  streamManager = new StreamManager()
})

// Keyboard shortcuts
document.addEventListener("keydown", (e) => {
  // Press 'A' to add stream
  if (e.key === "a" || e.key === "A") {
    if (
      !document.getElementById("addStreamModal").style.display ||
      document.getElementById("addStreamModal").style.display === "none"
    ) {
      streamManager.showAddStreamModal()
    }
  }

  // Press 'R' to refresh
  if (e.key === "r" || e.key === "R") {
    if (
      !document.getElementById("addStreamModal").style.display ||
      document.getElementById("addStreamModal").style.display === "none"
    ) {
      streamManager.loadStreams()
    }
  }

  // Press 'Escape' to close modal
  if (e.key === "Escape") {
    streamManager.hideAddStreamModal()
  }
})
