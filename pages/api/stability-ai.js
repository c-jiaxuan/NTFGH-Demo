import { isNumberObject } from "util/types";
import fs from 'fs';
import path from 'path';
import { stabilityAI_config } from "../../public/js/config/stabilityAI-config.js";

export default async function stabilityAI_generateImage(req, res) {
  let body = '';
  req.on('data', chunk => body += chunk);
  req.on('end', async () => {
      try {
        const { input } = JSON.parse(body);
        console.log('Stability AI input recieved: ' + input);

        const response = await stabilityAI_generateImg(input);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ response }));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
  });
}

async function stabilityAI_generateImg(requestPrompt){
  var body = {
    steps: stabilityAI_config.requestBody.steps,
    width: stabilityAI_config.requestBody.width,
    height: stabilityAI_config.requestBody.height,
    seed: stabilityAI_config.requestBody.seed,
    cfg_scale: stabilityAI_config.requestBody.cfg_scale,
    samples: stabilityAI_config.requestBody.samples,
    style_preset: stabilityAI_config.requestBody.style_preset, 
    text_prompts: [
      {
        "text": requestPrompt,
        "weight": stabilityAI_config.requestBody.weight
      }
    ],
  };

  var options = {
    method: 'POST',
    headers: {
      Accept: "application/json",
      'content-type': 'application/json',
      Authorization: stabilityAI_config.STABILITY_AI_TOKEN
    },
    body: JSON.stringify(body),
  };

  try {
    console.log('Stability AI fetching...');

    const response = await fetch(stabilityAI_config.STABILITY_AI_ENDPOINT, options);

    if (!response.ok) {
      throw new Error(`Fetch error: ${response.status}`);
    }

    const data = await response.json();
    console.log('StabilityAI API: Success:', data);

    if (data.artifacts && data.artifacts.length > 0 && data.artifacts[0].base64) {
      const base64 = data.artifacts[0].base64;
      const savedPath = saveBase64Image(base64);
      console.log('Image saved at: ' + savedPath);
    }

    return data;
  } catch (error) {
    console.error('StabilityAI API: Error:', error);
    return { error: error.message };
  }
}

// Saves the images generated into the servers local storage
function saveBase64Image(base64, baseName = stabilityAI_config.baseName, folder = stabilityAI_config.saveFolder, extension = stabilityAI_config.extension) {
    const base64Data = base64.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');

    if (!fs.existsSync(folder)) {
        fs.mkdirSync(folder, { recursive: true });
    }

    const filename = getTimestampedFilename(baseName, extension);
    const filePath = path.join(folder, filename);
    fs.writeFileSync(filePath, buffer);

    return filePath;
}

// Dynamically generates the file names for the images generated
function getTimestampedFilename(baseName = stabilityAI_config.baseName, extension = stabilityAI_config.extension) {
  const now = new Date();
  const timestamp = now.toISOString().replace(/[-:T.]/g, '').slice(0, 14);
  return `${baseName}_${timestamp}${extension}`;
}