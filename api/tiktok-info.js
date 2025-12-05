// api/tiktok-info.js
module.exports = async function handler(req, res) {
  const fetch = (await import("node-fetch")).default;

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  try {
    const url = (req.query.url || "").toString().trim();
    if (!url) return res.status(400).json({ error: "Missing url parameter" });

    // Call TikWM API
    const apiRes = await fetch("https://www.tikwm.com/api/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url })
    });

    const data = await apiRes.json(); // <-- now works correctly
    if (!data?.data) return res.status(500).json({ error: "Failed to fetch TikTok data" });

    res.status(200).json({
      title: data.data.title,
      thumbnail: data.data.cover
    });

  } catch (err) {
    console.error("TikTok Info Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};
