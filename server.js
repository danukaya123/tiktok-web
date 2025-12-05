const express = require("express");
const fetch = require("node-fetch");

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static frontend files
app.use(express.static("public"));

// Route to download TikTok video
app.get("/download-video", async (req, res) => {
  const url = req.query.url;
  if (!url) return res.status(400).send("Missing URL");

  try {
    const response = await fetch(url);
    const buffer = await response.buffer();

    res.set({
      "Content-Type": "video/mp4",
      "Content-Disposition": "attachment; filename=tiktok_video.mp4"
    });

    res.send(buffer);
  } catch (err) {
    console.error(err);
    res.status(500).send("Download failed");
  }
});

// Route to download TikTok audio
app.get("/download-audio", async (req, res) => {
  const url = req.query.url;
  if (!url) return res.status(400).send("Missing URL");

  try {
    const response = await fetch(url);
    const buffer = await response.buffer();

    res.set({
      "Content-Type": "audio/mpeg",
      "Content-Disposition": "attachment; filename=tiktok_audio.mp3"
    });

    res.send(buffer);
  } catch (err) {
    console.error(err);
    res.status(500).send("Download failed");
  }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
