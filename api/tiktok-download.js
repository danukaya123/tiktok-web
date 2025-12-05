// api/tiktok-download.js
export default async function handler(req, res) {
  try {
    const fetch = (await import("node-fetch")).default;
    const he = await import("he");

    const url = (req.query.url || "").trim();
    const title = (req.query.title || "tiktok_video").trim();

    if (!url) return res.status(400).send("Missing `url` parameter");

    // Clean title and add brand prefix
    const safeTitle = he.decode(title)
      .normalize("NFC")
      .replace(/[\u200B-\u200D\uFEFF]/g, "")
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "_")
      .toLowerCase();

    const filename = `quizontal_${safeTitle}.mp4`;

    // Fetch video from TikTok CDN
    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch video");

    // Force download headers
    res.setHeader("Content-Type", "video/mp4");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);

    response.body.pipe(res);
  } catch (err) {
    console.error("TikTok Download error:", err);
    res.status(500).send("Failed to download video");
  }
}
