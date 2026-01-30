import axios from "axios";

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "5mb"
    }
  }
};

export default async function handler(req, res) {
  // Hanya terima POST
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  try {
    const payload = req.body;

    // Cek apakah payload ada dan benar
    console.log('Received payload:', payload);  // Log payload GitHub

    if (!payload || !payload.commits) {
      return res.status(200).send("Not a push event");
    }

    const repo = payload.repository.full_name;
    const branch = payload.ref.replace("refs/heads/", "");
    const pusher = payload.pusher.name;

    const commits = payload.commits
      .map(c => `• **${c.message}**\n  ${c.url}`)
      .join("\n");

    const message = {
      content: `🚀 **New push to ${repo}**\n👤 ${pusher}\n🌿 Branch: \`${branch}\`\n\n${commits}`
    };

    console.log("Sending to Discord:", message);  // Log message yang dikirim ke Discord

    await axios.post(process.env.DISCORD_WEBHOOK_URL, message);

    return res.status(200).send("OK");
  } catch (err) {
    console.error("Webhook error:", err);
    return res.status(200).send("Handled");  // Harus tetap 200 ke GitHub
  }
}
