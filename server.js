const express = require("express")
const cors = require("cors")
const path = require("path")

const app = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.static("public"))

// Sample streaming links - replace these with your actual streaming URLs
const streamingLinks = [
  {
    id: 1,
    title: "Ricardinho ACF",
    url: "https://www.youtube.com/embed/OHOqS68gor8",
    type: "youtube",
  },
  {
    id: 2,
    title: "Ratão",
    url: "https://www.youtube.com/embed/48cCVqTGFVA",
    type: "youtube",
  },
  {
    id: 3,
    title: "Tonymek",
    url: "https://www.youtube.com/embed/oTBujuWgnI8",
    type: "youtube",
  },
  {
    id: 4,
    title: "Lucas",
    url: "https://www.youtube.com/embed/dtfCe5KvD4E",
    type: "youtube",
  },
]

// Routes
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"))
})

// API endpoint to get streaming links
app.get("/api/streams", (req, res) => {
  res.json({
    success: true,
    streams: streamingLinks,
  })
})

// Utility function to convert YouTube URLs to embed format
function processYouTubeUrl(url) {
  // Match various YouTube URL formats
  const regex =
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/
  const match = url.match(regex)
  if (match) {
    return `https://www.youtube.com/embed/${match[1]}`
  }
  return url
}

// Utility function to process URLs based on type
function processStreamUrl(url, type) {
  switch (type) {
    case "youtube":
      return processYouTubeUrl(url)
    case "twitch":
      // Convert Twitch URLs to embed format
      const twitchRegex = /twitch\.tv\/([^\/\n?#]+)/
      const twitchMatch = url.match(twitchRegex)
      if (twitchMatch) {
        return `https://player.twitch.tv/?channel=${twitchMatch[1]}&parent=localhost`
      }
      return url
    default:
      return url
  }
}

// API endpoint to add a new stream
app.post("/api/streams", (req, res) => {
  const { title, url, type = "custom" } = req.body

  if (!title || !url) {
    return res.status(400).json({
      success: false,
      message: "Title and URL are required",
    })
  }

  // Process the URL based on the type to ensure it's in the correct format
  const processedUrl = processStreamUrl(url, type)

  const newStream = {
    id: streamingLinks.length + 1,
    title,
    url: processedUrl,
    type,
  }

  streamingLinks.push(newStream)

  res.json({
    success: true,
    stream: newStream,
  })
})

// API endpoint to remove a stream
app.delete("/api/streams/:id", (req, res) => {
  const streamId = parseInt(req.params.id)
  const index = streamingLinks.findIndex((stream) => stream.id === streamId)

  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: "Stream not found",
    })
  }

  streamingLinks.splice(index, 1)

  res.json({
    success: true,
    message: "Stream removed successfully",
  })
})

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
  console.log(`Available streams: ${streamingLinks.length}`)
})
