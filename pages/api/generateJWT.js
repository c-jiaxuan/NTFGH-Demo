import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config(); // Load variables from .env

const userKey = process.env.USER_KEY;
const appId = process.env.APP_ID;
const openaiKey = process.env.OPENAI_API_KEY;

const payload = {
  appId: appId,
  platform: "web",
};

const options = {
  header: { typ: "JWT", alg: "HS256" },
  expiresIn: 60 * 5, // 5 mins
};

function generateJWT(req, res) {
  try {
    if (!userKey || !appId || !openaiKey) {
      return res.status(500).json({ error: "Missing environment config" });
    }

    const clientToken = jwt.sign(payload, userKey, options);

    res.json({
      appId: payload.appId,
      token: clientToken,
      openaiKey: openaiKey // ⚠️ Send only if this is a trusted/internal API
    });
  } catch (e) {
    console.log("JWT generation error:", e.name, e.message);
    res.status(500).json({ error: e.message });
  }
}

export default function handler(req, res) {
  if (req.method === "GET") return generateJWT(req, res);
  res.status(405).json({ error: "Method Not Allowed" });
}
