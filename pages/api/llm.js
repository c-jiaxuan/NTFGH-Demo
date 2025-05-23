import https from "https";

var bot_app = "sgroots"; // Don't change this
var bot_tone = "Succinct"; // Professional, Casual, Enthusiastic, Informational, Funny, Succinct
var bot_format = "Summary"; // Summary, Report, Bullet Points, LinkedIn Post, Email
var bot_language = "English";
var bot_followup = true;

var llm_summarise_api_url = 'https://gramener.com/docsearch/summarize';
var llm_similarity_api_url = 'https://gramener.com/docsearch/similarity';

const maxSelected = 10;

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
            const { input, results } = JSON.parse(body);
            const response = await sendToSummarize(input, results);

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

    var queryString = llm_similarity_api_url + "?app=" + bot_app + "&q=" + message + "&k=" + maxSelected;
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
async function sendToSummarize(message, result) {

    // Display processing status

    result.content = "";
    result.done = false;

    //Setup request body
    const payload = {
        "app": bot_app,
        "q": message + ". Answer in 2 full and very short sentences. Don't put the title in front.",
        "context": result.matches
                .slice(0, maxSelected)
                .map((d, i) => `DOC_ID: ${i + 1}\nTITLE: ${d.metadata.h1}\n${d.page_content}\n`)
                .join("\n"),
        "Followup": bot_followup,
        "Tone": bot_tone,
        "Format": bot_format,
        "Language": bot_language
    };
    
    try {
        console.log("LLM API: Summarize fetching API...");
        const response = await fetch(llm_summarise_api_url, {
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