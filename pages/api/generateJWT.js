import dotenv from "dotenv";

dotenv.config(); // Load variables from .env

function generateJWT(req, res) {
  try {
    const openaiKey = process.env.OPENAI_API_KEY;

    if (!openaiKey) {
      return res.status(500).json({ error: "Missing environment config" });
    }

    res.json({
      openaiKey: openaiKey // ⚠️ Send only if this is a trusted/internal API
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

export default function handler(req, res) {
  if (req.method === "GET") return generateJWT(req, res);
  res.status(405).json({ error: "Method Not Allowed" });
}
