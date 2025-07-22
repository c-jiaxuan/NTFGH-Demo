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
    },
    img2vid_prompt_msg: {
        en: 'Sure! lets generate a video from an image! Please upload the image you want to use.',
        zh: '当然，让我们从图片生成视频！请上传您想使用的图片。'
    }
};

export const messageIntent = {
    NONE:    0,
    TXT2IMG: 1,
    TXT2VID: 2,
    IMG2VID: 3,
    EXTDVID: 4
}

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
    "render a video",
    "can you make a video",
    "motion version",
    "animated version",
    "short video",
    "clip of",
    "film this",
];

export const img2VidKeywords = [
    "turn this image into a video",
    "animate this picture",
    "animate this image",
    "make this image move",
    "convert this image to video",
    "bring this image to life",
    "motion version of this image",
    "make this still image dynamic",
    "video from this image",
    "loop this picture",
    "motion effect on this image"
];

export const extdVideoKeywords = [
    "longer video",
    "extend the animation",
    "make a full scene",
    "add more scenes",
    "continue the video",
    "expand this into a story",
    "storyline video",
    "turn this into a film",
    "narrative version",
    "video with more detail",
    "generate a full-length animation",
    "make a detailed video",
    "extend the clip",
    "add a beginning and end"
];
