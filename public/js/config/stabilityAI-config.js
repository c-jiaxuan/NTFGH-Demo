export const stabilityAI_config = {
    //const STABILITY_AI_ENDPOINT = "https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image";
    //Authorization: "Bearer sk-q0IgQDG2W2ZI20gFMuf2Yugsdrx1EPdKkVb9xZv7VjjdP0Up" //James key
    //Authorization: "Bearer sk-UwHznwoRM3f7hmEbplGVCVf8HVpp6osePYAzBEefoFXSXKLz" //Alvin key
    STABILITY_AI_ENDPOINT: "https://api.stability.ai/v1/generation/stable-diffusion-v1-6/text-to-image",
    STABILITY_AI_TOKEN: "Bearer sk-q0IgQDG2W2ZI20gFMuf2Yugsdrx1EPdKkVb9xZv7VjjdP0Up",
    requestBody: {
        steps: 40,
        width: 1024,
        height: 1024,
        seed: 0,
        cfg_scale: 5,
        samples: 1,
        style_preset: "photographic",
        weight: 1
    },
    baseName: 'image',
    saveFolder: './stabilityAI/images',
    extension: '.png'
}