import { klingAI_Vid_config } from "../../../public/js/config/klingAI-config.js";
import { klingAI_KEYS } from "../../../public/js/env/klingAI-keys.js";
// import generateToken from "../generateJWT_KlingAI.js";
import { generateJWT_native, decodeJWT } from '../jwt-native.js';

export default async function klingAI_TextToVideo(req, res) {
  let body = '';
  req.on('data', chunk => body += chunk);
  req.on('end', async () => {
      try {
        const { input } = JSON.parse(body);
        console.log('KlingAI input recieved: ' + input);

        const response = await createTextToVidTask(input);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ response }));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
  });
}

async function createVidTask(userInput) {
    const token = await generateJWT_native(klingAI_KEYS.access_key, klingAI_KEYS.secret_key);
    if (token != null) {
        console.log('Successfully generated token: ' + `Bearer ${token}`);
    }
    const url = klingAI_Vid_config.KLING_AI_ENDPOINT;
    const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };
    const body = {
        model_name: klingAI_Vid_config.requestBody.model_name,
        prompt: userInput,
        // negative_prompt: 'Your negative text prompt',
        // image: 'Base64 encoded image string or image URL',
        // cfg_scale: 'float', // Flexibility in video generation, The higher the value, the lower the model's degree of flexibility, and the stronger the relevance to the user's prompt. Value range: [0, 1]
        // mode: 'std', // Video Generation mode, [std: Standard, pro: Professional]
        // duration: '5',   // Video length in seconds [5, 10]
        // callback_url: klingAI_Vid_config.requestBody.callback_url
    };

    try {
        console.log('\nMaking FETCH request: ');
        console.log("Method:", 'POST');
        console.log("Headers:", headers);
        console.log("Body:", JSON.stringify(body));
        console.log("\n");
        const response = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(body)
        });

        const data = await response.json();

        if (response.code !== 0) {
            console.error(`Error ${response.status}: ${data.message}`);
            console.error(`Service Code: ${data.code}`);
            console.error(`Request ID: ${data.request_id}`);
            throw new Error('Response not ok');
        }

        return data;
    } catch (error) {
        console.error('Error:', error);
    }
};
