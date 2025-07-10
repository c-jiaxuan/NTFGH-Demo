import { klingAI_KEYS } from "../../../public/js/env/klingAI-keys.js";
import { klingAI_Img_config } from "../../../public/js/config/klingAI-config.js";
import generateToken from "../generateJWT_KlingAI.js";
import fs from 'fs';
import path from 'path';

export default async function klingAI_queryTask(req, res) {
  let body = '';
  req.on('data', chunk => body += chunk);
  req.on('end', async () => {
      try {
        const { input } = JSON.parse(body);
        console.log('KlingAI input recieved: ' + input);

        const response = await queryTask(input);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ response }));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
  });
}

async function queryTask(taskId) {
    const token = await generateToken(klingAI_KEYS.access_key, klingAI_KEYS.secret_key);
    if (token != null) {
        console.log('Successfully generated token: ' + `Bearer ${token}`);
    }
    // 【Image Generation】Query Task（Single) Request URL is : /v1/images/generations/{id}
    // 【Text to Video】Query Task（Single）Request URL is : /v1/videos/text2video/{id}
    const url = `${klingAI_Img_config.KLING_AI_ENDPOINT}/${taskId}`;
    const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };

    try {
        console.log('\nMaking FETCH request: ');
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

        const images = data.data.task_result?.images || [];
        if (images.length !== 0) {
            images.forEach(async (img, index) => {
                const path = await saveURLImage(img.url);
                console.log('Saved image: [' + img.url + '] at:');
                console.log(path + '\n');
            });
        } else {
            console.log('NO IMAGES');
        }

        return data;
    } catch (error) {
        console.error('Error:', error);
    }
};

// Saves the images generated into the servers local storage
async function saveURLImage(url, baseName = klingAI_Img_config.baseName, folder = klingAI_Img_config.saveFolder, extension = klingAI_Img_config.extension) {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer, 'binary');

    if (!fs.existsSync(folder)) {
        fs.mkdirSync(folder, { recursive: true });
    }

    const filename = getTimestampedFilename(baseName, extension);
    const filePath = path.join(folder, filename);
    fs.writeFileSync(filePath, buffer);

    return filePath;
}

// Dynamically generates the file names for the images generated
function getTimestampedFilename(baseName = klingAI_Img_config.baseName, extension = klingAI_Img_config.extension) {
  const now = new Date();
  const timestamp = now.toISOString().replace(/[-:T.]/g, '').slice(0, 14);
  return `${baseName}_${timestamp}${extension}`;
}