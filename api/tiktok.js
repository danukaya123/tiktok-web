// api/tiktok.js - COMBINED SINGLE API
module.exports = async function handler(req, res) {
  const fetch = (await import("node-fetch")).default;
  const he = (await import("he")).default;

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,POST");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  try {
    const { url, action = "info", type = "video", title = "" } = req.query;
    if (!url) return res.status(400).json({ error: "Missing TikTok URL" });

    // Fetch from TikWM API
    const tikwmRes = await fetch("https://www.tikwm.com/api/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: url.toString().trim() })
    });

    const data = await tikwmRes.json();
    if (!data?.data) return res.status(500).json({ error: "Failed to fetch TikTok data" });

    // ACTION 1: Get video info (metadata)
    if (action === "info") {
      return res.status(200).json({
        ok: true,
        title: data.data.title,
        thumbnail: data.data.cover,
        videoUrl: data.data.play,
        audioUrl: data.data.music,
        author: data.data.author?.nickname || "Unknown",
        duration: data.data.duration || 0
      });
    }

    // ACTION 2: Download media
    if (action === "download") {
      const fileUrl = type === "audio" ? data.data.music : data.data.play;
      if (!fileUrl) throw new Error("Download URL not found");

      // Clean filename
      const safeTitle = he.decode(title || data.data.title)
        .normalize("NFC")
        .replace(/[\u200B-\u200D\uFEFF]/g, "")
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "_")
        .toLowerCase();

      const filename = `quizontal_${safeTitle}.${type === "audio" ? "mp3" : "mp4"}`;

      // Fetch and stream the file
      const fileRes = await fetch(fileUrl);
      if (!fileRes.ok) throw new Error("Failed to fetch media");

      res.setHeader("Content-Type", type === "audio" ? "audio/mpeg" : "video/mp4");
      res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);

      return fileRes.body.pipe(res);
    }

    return res.status(400).json({ error: "Invalid action. Use 'info' or 'download'" });

  } catch (err) {
    console.error("TikTok API Error:", err);
    
    // Return JSON error for info requests
    if (req.query.action === "info") {
      return res.status(500).json({ 
        ok: false, 
        error: err.message || "Server error" 
      });
    }
    
    // For download requests, send plain error
    res.status(500).send("Failed to download media");
  }
};
