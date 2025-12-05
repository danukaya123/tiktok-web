module.exports = async function handler(req, res) {
  const fetch = (await import("node-fetch")).default;
  const he = (await import("he")).default;

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  const { url = "", type = "video", title = "tiktok_video" } = req.query;
  if (!url) return res.status(400).send("Missing url parameter");

  try {
    // Clean title
const safeTitle = he.decode(title)
  .normalize("NFC")
  .replace(/[\u200B-\u200D\uFEFF]/g, "")
  .replace(/[^\w\s-]/g, "")
  .replace(/\s+/g, "_")
  .toLowerCase();

// Add Quizontal prefix
const filename = type === "audio"
  ? `quizontal_${safeTitle}.mp3`
  : `quizontal_${safeTitle}.mp4`;

    // Fetch TikTok download URLs
    const tikwmRes = await fetch("https://www.tikwm.com/api/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url })
    });

    const data = await tikwmRes.json();
    if (!data?.data) throw new Error("Failed to fetch TikTok data");

    const fileUrl = type === "audio" ? data.data.music : data.data.play;
    if (!fileUrl) throw new Error("Download URL not found");

    // Proxy file with download headers
    const fileRes = await fetch(fileUrl);
    if (!fileRes.ok) throw new Error("Failed to fetch media");

    res.setHeader("Content-Type", type === "audio" ? "audio/mpeg" : "video/mp4");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);

    fileRes.body.pipe(res);
  } catch (err) {
    console.error("TikTok Download Error:", err);
    res.status(500).send("Failed to download media");
  }
};
