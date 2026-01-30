import axios from "axios";

export default async function handler(req, res) {
  // Hanya terima POST
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  // Ambil payload GitHub
  const payload = req.body;

  // Pastikan ini event push
  if (!payload.commits || payload.commits.length === 0) {
    return res.status(200).send("No commits");
  }

  const repo = payload.repository.full_name;
  const branch = payload.ref.replace("refs/heads/", "");
  const pusher = payload.pusher.name;

  const commits = payload.commits
    .map(
      (c) =>
        `• **${c.message}**\n  ${c.url}`
    )
    .join("\n");

  const message = {
    content: `🚀 **New push to ${repo}**\n👤 ${pusher}\n🌿 Branch: \`${branch}\`\n\n${commits}`
  };

  try {
    await axios.post(process.env.DISCORD_WEBHOOK_URL, message);
    return res.status(200).send("OK");
  } catch (error) {
    console.error(error.response?.data || error.message);
    return res.status(500).send("Failed to send to Discord");
  }
}
