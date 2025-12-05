// api/tiktok-download.js
const fetch = (...args) => import("node-fetch").then(({ default: fetch }) => fetch(...args));
const he = require("he");

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();

  try {
    const url = (req.query.url || "").toString().trim();
    const title = (req.query.title || "tiktok_video").toString().trim();

    if (!url) return res.status(400).send("Missing `url` parameter");

    const safeTitle = he.decode(title)
      .normalize("NFC")
      .replace(/[\u200B-\u200D\uFEFF]/g, "")
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "_")
      .toLowerCase();

    const filename = `quizontal_${safeTitle}.mp4`;

    // Redirect to video URL with download headers
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.redirect(url);

  } catch (err) {
    console.error("TikTok Download error:", err);
    res.status(500).send("Failed to download video");
  }
};
