// api/tiktok-info.js
const { downloadTiktok } = require("@mrnima/tiktok-downloader");
const he = require("he");

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();

  try {
    const url = (req.query.url || "").toString().trim();
    if (!url) return res.status(400).json({ ok: false, message: "Missing `url` parameter" });

    const result = await downloadTiktok(url);
    if (!result || !result.status) return res.status(404).json({ ok: false, message: "Video not found" });

    const title = he.decode(result.result.title || "TikTok Video").normalize("NFC");
    const thumbnail = result.result.image || null;
    const urls = {
      hd: result.result.dl_link.download_mp4_hd || null,
      mp4_1: result.result.dl_link.download_mp4_1 || null,
      mp4_2: result.result.dl_link.download_mp4_2 || null,
    };

    res.json({ ok: true, title, thumbnail, urls });
  } catch (err) {
    console.error("TikTok API error:", err);
    res.status(500).json({ ok: false, message: "Failed to fetch TikTok video", error: err.message });
  }
};
