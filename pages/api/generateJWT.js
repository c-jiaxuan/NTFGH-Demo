import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config(); // Load variables from .env (for local dev only)

function generateJWT(req, res) {
  try {
    // ✅ Always read env vars inside the function
    const userKey = process.env.USER_KEY;
    const appId = process.env.APP_ID;
    const openaiKey = process.env.OPENAI_API_KEY;

    // ❌ If any variable is missing, return error
    if (!userKey || !appId || !openaiKey) {
      return res.status(500).json({ error: "Missing environment config" });
    }

    const payload = {
      appId,
      platform: "web",
    };

    const options = {
      header: { typ: "JWT", alg: "HS256" },
      expiresIn: 60 * 5, // 5 minutes
    };

    const token = jwt.sign(payload, userKey, options);

    // ⚠️ Only send openaiKey if this is a secure internal API
    res.status(200).json({
      appId,
      token,
      // openaiKey, // 🚨 REMOVE if this goes to frontend!
    });
  } catch (e) {
    console.error("JWT generation error:", e.message);
    res.status(500).json({ error: e.message });
  }
}

export default function handler(req, res) {
  if (req.method === "GET") return generateJWT(req, res);
  return res.status(405).json({ error: "Method Not Allowed" });
}
