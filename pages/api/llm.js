import { llm_config } from '../../public/js/config/llm-config.js'

var bot_language = "English";

export async function gramanerSimilarity(req, res) {
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

export async function gramanerSummarize(req, res) {
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