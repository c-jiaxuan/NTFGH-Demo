import { klingAI_Img_config } from '../../../public/js/config/klingAI-config.js';
import { klingAI_KEYS } from '../../../public/js/env/klingAI-keys.js';
// import generateToken from "./generateJWT_KlingAI.js";
import { generateJWT_native, decodeJWT } from '../jwt-native.js';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'; // ONLY FOR DEVELOPMENT, REMOVE BEFORE PRODUCTION

export default async function klingAI_TextToImage(req, res) {
  let body = '';
  req.on('data', chunk => body += chunk);
  req.on('end', async () => {
      try {
        const { input } = JSON.parse(body);
        console.log('KlingAI input recieved: ' + input);

        const response = await createTextToImgTask(input);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ response }));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
  });
}

async function createTextToImgTask(userInput) {
    // const token = generateToken(klingAI_KEYS.access_key, klingAI_KEYS.secret_key);
    const token = await generateJWT_native(klingAI_KEYS.access_key, klingAI_KEYS.secret_key);
    console.log("\njwt-native generated token: " + token + "\n");
    if (token != null) {
        console.log('Successfully generated token: ' + `Bearer ${token}`);
    }
    const url = klingAI_Img_config.KLING_AI_ENDPOINT;
    const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };
    const body = {
        model_name: klingAI_Img_config.requestBody.model_name,
        prompt: userInput,
        // negative_prompt: 'Your negative text prompt',
        // image: 'Base64 encoded image string or image URL',
        // image_reference: klingAI_Img_config.requestBody.image_reference,
        // image_fidelity: klingAI_Img_config.requestBody.image_fidelity,
        // human_fidelity: klingAI_Img_config.requestBody.human_fidelity,
        // n: klingAI_Img_config.requestBody.n,
        // aspect_ratio: klingAI_Img_config.requestBody.aspect_ratio,
        // callback_url: klingAI_Img_config.requestBody.callback_url
    };

    try {
        console.log('\nMaking FETCH request: ');
        console.log("Request URL:", url);
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
        console.log('klingAI image generation response: ' + JSON.stringify(data));

        if (data.code !== 0) {
            console.error(`Error ${response.status}: ${data.message}`);
            console.error(`Service Code: ${data.code}`);
            console.error(`Request ID: ${data.request_id}`);
            throw new Error('Response not ok');
        }

        // console.log('\n');
        // console.log(`Service Code: ${data.code}`);
        // console.log(`Message: ${data.message}`);
        // console.log(`Request ID: ${data.request_id}`);
        // console.log(`Task ID: ${data.data.task_id}`);
        // console.log(`Task Status: ${data.data.task_status}`);
        // console.log(`Created At: ${data.data.created_at}`);
        // console.log(`Updated At: ${data.data.updated_at}`);
        // console.log('\n');
        return data;
    } catch (error) {
        console.error('Error:', error);
    }
};
