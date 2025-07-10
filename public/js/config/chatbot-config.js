export const chatbot_config = {
    start_msg: {
        en: 'Hello, how can I help you today?',
        zh: '你好，今天我能帮你什么？'
    },
    error_msg: {
        en: 'Sorry, I did not understand that.',
        zh: '抱歉，我不明白这个。'
    },
    wait_msg: {
        en: 'Please wait while I am processing the response.',
        zh: '请稍等，我正在处理响应。'
    },
    image_msg: {
        en: 'Please wait while the image is generating.',
        zh: '请稍等，图片正在生成中。'
    },
    success_image_msg: {
        en: 'Here is the generated image.',
        zh: '这是生成的图像。'
    },
    failed_image_msg: {
        en: 'Sorry, I am unable to generate the image, please try again later.',
        zh: '抱歉，我无法生成图片，请稍后再试。'
    },
    video_msg: {
        en: 'Please wait while the video is generating.',
        zh: '请稍等，视频正在生成中。'
    },
    success_video_msg: {
        en: 'Here is the generated video.',
        zh: '这是生成的视频。'
    },
    failed_video_msg: {
        en: 'Sorry, I am unable to generate the video, please try again later.',
        zh: '抱歉，我无法生成视频，请稍后再试。'
    }
};

export const imageKeywords = [
    "draw",
    "generate an image",
    "create a picture",
    "show me",
    "illustrate",
    "visualize",
    "make a diagram",
    "can you make a picture",
    "sketch",
    "render",
    "image of",
    "picture of"
];

export const videoKeywords = [
    "make a video",
    "generate a video",
    "create a video",
    "show me a video",
    "animate",
    "render a video",
    "can you make a video",
    "visualize this in motion",
    "video of",
    "motion version",
    "animated version",
    "short video",
    "clip of",
    "film this",
    "turn this into a video"
];