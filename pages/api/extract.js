import https from "https";

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'; // dev only

const agent = new https.Agent({ rejectUnauthorized: false });

export async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  let body = '';
  req.on('data', chunk => {
    body += chunk;
  });

  req.on('end', async () => {
    try {
      const parsedBody = JSON.parse(body);
      const { transcript } = parsedBody;

      const agent = new https.Agent({ rejectUnauthorized: false });

      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
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
        }),
        agent,
      });

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content || "{}";
      const extracted = JSON.parse(content);

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(extracted));
    } catch (err) {
      console.error("🔥 Handler error:", err);
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Internal Server Error" }));
    }
  });
}

