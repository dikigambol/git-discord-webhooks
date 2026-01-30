import axios from "axios";

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "5mb", // Pastikan payload cukup besar
    },
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end(); // Menghindari method selain POST
  }

  try {
    const payload = req.body;
    console.log('Received deployment info:', JSON.stringify(payload, null, 2));

    // Membuat message yang akan dikirim ke Discord
    const message = {
      content: `Deployment Info: ${payload.content}`,
    };

    // Mengirimkan ke Discord menggunakan Webhook URL
    await axios.post(process.env.DISCORD_WEBHOOK_URL, message);

    return res.status(200).send("OK");
  } catch (err) {
    console.error("Error during webhook processing:", err);
    return res.status(500).send("Error occurred");
  }
}
