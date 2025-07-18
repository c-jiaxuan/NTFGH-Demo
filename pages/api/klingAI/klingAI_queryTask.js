import { messageIntent } from "../../../public/js/config/chatbot-config.js";
import { klingAI_KEYS } from "../../../public/js/env/klingAI-keys.js";
import { klingAI_Img_config } from "../../../public/js/config/klingAI-config.js";
import { klingAI_Vid_config } from "../../../public/js/config/klingAI-config.js";
import { klingAI_Img2Vid_Config } from "../../../public/js/config/klingAI-config.js";
import { saveURLMedia } from "./klingAI_helper.js"
import generateToken from "../generateJWT_KlingAI.js";
// import { generateJWT_native, decodeJWT } from '../jwt-native.js';

export default async function klingAI_queryTask(req, res) {
  let body = '';
  req.on('data', chunk => body += chunk);
  req.on('end', async () => {
      try {
        const { input, endpoint } = JSON.parse(body);
        console.log('[queryTask] KlingAI input recieved: ' + input, ', ' + endpoint);

        const response = await queryTask(input, endpoint);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ response }));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
  });
}

async function queryTask(taskId, _endpoint) {
    const token = await generateToken(klingAI_KEYS.access_key, klingAI_KEYS.secret_key);
    if (token != null) {
        console.log('Successfully generated token: ' + `Bearer ${token}`);
    }
    // 【Image Generation】Query Task（Single) Request URL is : /v1/images/generations/{id}
    // 【Text to Video】Query Task（Single）Request URL is : /v1/videos/text2video/{id}
    let endpoint = null;
    if (_endpoint == messageIntent.TXT2IMG) {
        endpoint = klingAI_Img_config.KLING_AI_ENDPOINT
    } else if (_endpoint == messageIntent.TXT2VID) {
        endpoint = klingAI_Vid_config.KLING_AI_ENDPOINT
    } else if (_endpoint == messageIntent.IMG2VID) {
        endpoint = klingAI_Img2Vid_Config.KLING_AI_ENDPOINT
    }
    const url = `${endpoint}/${taskId}`;
    const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };

    try {
        console.log('\n[queryTask]');
        console.log('Making FETCH request: ');
        console.log("Request URL:", url);
        console.log("Method:", 'GET');
        console.log("Headers:", headers);
        console.log("\n");
        const response = await fetch(url, {
            method: 'GET',
            headers: headers
        });

        const data = await response.json();
        console.log('klingAI queryTask response: ' + JSON.stringify(data));

        if (data.code !== 0) {
            console.error(`Error ${response.status}: ${data.message}`);
            console.error(`Service Code: ${data.code}`);
            console.error(`Request ID: ${data.request_id}`);
            throw new Error('Response not ok');
        }

        // Saveing results, done within server side
        const images = data?.data?.task_result?.images || [];
        const videos = data?.data?.task_result?.videos || [];

        if (images.length === 0 && videos.length === 0) {
            console.log('NO MEDIA FOUND');
        } else {
            // Save images
            console.log("Images received:", images.map(i => i.url));
            for (const img of images) {
                try {
                    const path = await saveURLMedia(img.url, klingAI_Img_config.baseName);
                    console.log(`✅ Saved image: [${img.url}]\n→ at: ${path}\n`);
                } catch (err) {
                    console.error(`❌ Failed to save image [${img.url}]: ${err.message}`);
                }
            }

            // Save videos
            console.log("Videos received:", videos.map(i => i.url));
            for (const vid of videos) {
                try {
                    const path = await saveURLMedia(vid.url, klingAI_Vid_config.baseName);
                    console.log(`🎬 Saved video: [${vid.url}]\n→ at: ${path}\n`);
                } catch (err) {
                    console.error(`❌ Failed to save video [${vid.url}]: ${err.message}`);
                }
            }
        }

        return data;
    } catch (error) {
        console.error('Error:', error);
    }
};

