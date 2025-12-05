const express = require("express");
const fetch = require("node-fetch");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

app.post("/download", async (req, res) => {
  const { url, type } = req.body; // type = 'video' | 'audio'

  try {
    // Fetch the TikTok media
    const response = await fetch(url);
    if (!response.ok) return res.status(400).send("Failed to fetch media.");

    // Set headers to force download
    const contentType = type === "audio" ? "audio/mpeg" : "video/mp4";
    const ext = type === "audio" ? "mp3" : "mp4";
    res.setHeader("Content-Type", contentType);
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="tiktok.${ext}"`
    );

    // Pipe the response to the browser
    response.body.pipe(res);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error downloading media.");
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
