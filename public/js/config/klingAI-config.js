export const klingAI_config = {
    KLING_AI_ENDPOINT: "",
    KLING_AI_TOKEN: "",
    requestBody: {
        model_name: 'kling-v1',
        image: 'Base64 encoded image string or image URL',
        image_reference: 'subject',
        image_fidelity: 0.5,
        human_fidelity: 0.45,
        n: 1,
        aspect_ratio: '16:9',
        callback_url: 'Your callback URL'
    },
    baseName: 'image',
    saveFolder: './klingAI/images',
    extension: '.png'
};