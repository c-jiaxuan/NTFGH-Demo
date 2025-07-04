export const stabilityAI_config = {
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