// api/tiktok-info.js
export default async function handler(req, res) {
  try {
    const { downloadTiktok } = await import("@mrnima/tiktok-downloader");

    const url = (req.query.url || "").trim();
    if (!url) return res.status(400).json({ ok: false, message: "Missing `url` parameter" });

    const data = await downloadTiktok(url);

    if (!data.status || !data.result.download_mp4_1) {
      return res.status(404).json({ ok: false, message: "Video not found or cannot download" });
    }

    return res.status(200).json({ ok: true, result: data.result });
  } catch (err) {
    console.error("TikTok API error:", err);
    return res.status(500).json({ ok: false, message: "Internal Server Error", error: err.message });
  }
}
