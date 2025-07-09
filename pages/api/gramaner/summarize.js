import { llm_config } from '../../../public/js/config/llm-config.js'

// process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'; // 👈 Add this at the top ONLY for development

var bot_language = "English";

export default async function gramanerSummarize(req, res) {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', async () => {
        try {
            const { input, results, lang } = JSON.parse(body);
            const response = await sendToSummarize(input, results, lang);

            res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ response }));
        } catch (err) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: err.message }));
        }
    });
}

// Send user question to LLMs => retrieve and process the response
// message = user's message
// result = result from the similarity API call used to build a context to the user's message
async function sendToSummarize(message, result, lang) {

    // Display processing status

    result.content = "";
    result.done = false;

    //Setup request body
    const payload = {
        "app": llm_config.bot_app,
        "q": message + ". Answer in 2 full and very short sentences. Don't put the title in front. Add followup questions",
        "context": result.matches
                .slice(0, llm_config.maxSelected)
                .map((d, i) => `DOC_ID: ${i + 1}\nTITLE: ${d.metadata.h1}\n${d.page_content}\n`)
                .join("\n"),
        "Followup": llm_config.bot_followup,
        "Tone": llm_config.bot_tone,
        "Format": llm_config.bot_format,
        "Language": lang
    };
    
    try {
        console.log("LLM API: Summarize fetching API...");
        const response = await fetch(llm_config.llm_summarise_api_url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'accept': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error(`LLM API: Summary Fetch error: ${response.status}`);
        }

        const data = await response.json();
        console.log('LLM API: Summarize Success:', data);
        return data;
    } catch (error) {
        console.error('LLM API: Summarize Error:', error);
        return { error: error.message };
    }
}