import { llm_config } from '../../../public/js/config/llm-config.js'

var bot_language = "English";

export default async function gramanerSimilarity(req, res) {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', async () => {
        try {
            const { input } = JSON.parse(body);

            const response = await sendToSimilarity(input);

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ response }));
        } catch (err) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: err.message }));
        }
    });
}

// Sends in user message to retrieve documents similar to the message
// To be used with Summarize
async function sendToSimilarity(message) {

    if (message == '') {
        // If there is no message, return
        console.log("LLM API: Similarity No message detected, returning...");
        return;
    }

    var queryString = llm_config.llm_similarity_api_url + "?app=" + llm_config.bot_app + "&q=" + message + "&k=" + llm_config.maxSelected;
    console.log("LLM API: Similarity queryString = " + queryString);

    try {
        const response = await fetch (queryString, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`LLM API: Similarity Fetch error: ${response.status}`);
        }

        const data = await response.json();
        console.log('LLM API: Similarity Success:', data);
        return data;
    } catch (error) {
        console.error('LLM API: Similarity Error:', error);
        return { error: error.message };
    }
}