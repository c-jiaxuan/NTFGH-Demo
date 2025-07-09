import { llm_config } from "../../../public/js/config/llm-config.js";

export default async function gramanerHandler(req, res) {

    let body = '';
    req.on('data', chunk => {
      body += chunk;
    });

    req.on('end', async () => {
      try {
        const parsedBody = JSON.parse(body);
        const { entities, input } = parsedBody;

        console.log('➡️ Sent to extractor:', { entities, input });

        // Prepare the fetch request
        const response = await fetch(llm_config.llm_extract_api_url, {
          method: 'POST',
          headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({entities, input}),
        });

        // Check if the response is okay
        if (!response.ok) {
          return res.status(response.status).json({ error: 'Failed to fetch from entity extractor API' });
        }

        // Parse and return the JSON response
        const data = await response.json();
        console.log('data: ' + data);

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(data));
      } catch (err) {
        console.error("🔥 Handler error:", err);
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Internal Server Error" }));
      }
  });
}