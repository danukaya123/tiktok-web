// api/tiktok-info.js
const fetch = (...args) => import("node-fetch").then(({default: fetch}) => fetch);

export default async function handler(req, res) {
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: "Missing url parameter" });

  try {
    const apiRes = await fetch("https://www.tikwm.com/api/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url })
    });

    const data = await apiRes.json();
    if (!data?.data) return res.status(500).json({ error: "Failed to fetch TikTok data" });

    res.status(200).json({
      title: data.data.title,
      thumbnail: data.data.cover,
    });
  } catch (err) {
    console.error("TikTok Info Error:", err);
    res.status(500).json({ error: "Server error" });
  }
}
