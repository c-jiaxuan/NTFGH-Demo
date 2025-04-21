import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'; // 👈 Add this at the top ONLY for development

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { transcript } = req.body;

  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ error: "Missing OpenAI API key" });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "Extract name, relationship, phone number, and address from the user’s sentence. Return a JSON object with keys: name, relationship, phone_number, address.",
        },
        {
          role: "user",
          content: transcript,
        },
      ],
    });

    const content = completion.choices[0].message.content;
    res.status(200).json(JSON.parse(content));
  } catch (err) {
    console.error("🔥 OpenAI Error:", err);
    res.status(500).json({ error: "OpenAI request failed" });
  }
}
