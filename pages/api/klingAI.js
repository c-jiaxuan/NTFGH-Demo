import { klingAI_config } from "../../public/js/config/klingAI-config.js";

export default async function klingAI_generateImage(req, res) {
  let body = '';
  req.on('data', chunk => body += chunk);
  req.on('end', async () => {
      try {
        const { input } = JSON.parse(body);
        console.log('KlingAI input recieved: ' + input);

        const response = await createTask(input);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ response }));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
  });
}

async function createTask(userInput) {
    const url = klingAI_config.KLING_AI_ENDPOINT;
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': klingAI_config.KLING_AI_TOKEN
    };
    const body = {
        model_name: klingAI_config.requestBody.model_name,
        prompt: userInput,
        negative_prompt: 'Your negative text prompt',
        // image: 'Base64 encoded image string or image URL',
        image_reference: klingAI_config.requestBody.image_reference,
        image_fidelity: klingAI_config.requestBody.image_fidelity,
        human_fidelity: klingAI_config.requestBody.human_fidelity,
        n: klingAI_config.requestBody.n,
        aspect_ratio: klingAI_config.requestBody.aspect_ratio,
        callback_url: klingAI_config.requestBody.callback_url
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(body)
        });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log(data);
    return data;
    } catch (error) {
        console.error('Error:', error);
    }
};
