// api/tiktok.js
const fetch = (...args) => import("node-fetch").then(({default: fetch}) => fetch(...args));

export default async function handler(req, res) {
  try {
    const { url } = req.query;
    if (!url) return res.status(400).json({ error: "TikTok URL is required" });

    const api = "https://www.tikwm.com/api/";
    const response = await fetch(api, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url })
    });

    const data = await response.json();
    if (!data || !data.data) return res.status(500).json({ error: "Failed to fetch TikTok video" });

    return res.status(200).json({
      title: data.data.title,
      noWatermark: data.data.play,
      watermark: data.data.wmplay,
      audio: data.data.music
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}
