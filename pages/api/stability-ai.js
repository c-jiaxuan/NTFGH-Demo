import { isNumberObject } from "util/types";

//const STABILITY_AI_ENDPOINT = "https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image";
const STABILITY_AI_ENDPOINT = "https://api.stability.ai/v1/generation/stable-diffusion-v1-6/text-to-image";
const STABILITY_AI_TOKEN = "Bearer sk-q0IgQDG2W2ZI20gFMuf2Yugsdrx1EPdKkVb9xZv7VjjdP0Up";

export async function generateImage(req, res) {
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
    steps: 40,
    width: 1024,
    height: 1024,
    seed: 0,
    cfg_scale: 5,
    samples: 1,
    style_preset: "photographic", 
    text_prompts: [
      {
        "text": requestPrompt,
        "weight": 1
      }
    ],
  };

  var options = {
    method: 'POST',
    headers: {
      Accept: "application/json",
      'content-type': 'application/json',
      Authorization: "Bearer sk-q0IgQDG2W2ZI20gFMuf2Yugsdrx1EPdKkVb9xZv7VjjdP0Up" //James key
      //Authorization: "Bearer sk-UwHznwoRM3f7hmEbplGVCVf8HVpp6osePYAzBEefoFXSXKLz" //Alvin key
    },
    body: JSON.stringify(body),
  };

  try {
    console.log('Stability AI fetching...');

    const response = await fetch(STABILITY_AI_ENDPOINT, options);

    if (!response.ok) {
      throw new Error(`Fetch error: ${response.status}`);
    }

    const data = await response.json();
    console.log('StabilityAI API: Success:', data);
    return data;
  } catch (error) {
    console.error('StabilityAI API: Error:', error);
    return { error: error.message };
  }
}

export async function saveImage() {
  
}