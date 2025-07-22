import { basename } from "path";

export const klingAI_Img_config = {
    KLING_AI_ENDPOINT: 'https://api-singapore.klingai.com/v1/images/generations',
    requestBody: {
        model_name: 'kling-v1-5',  // Enum values：kling-v1, kling-v1-5, kling-v2
        prompt: '',
        image: 'Base64 encoded image string or image URL',
        image_reference: 'subject', // Enum values：subject(character feature reference), face(character appearance reference)
        image_fidelity: 0.5, // Face reference intensity for user-uploaded images during generation Value range：[0,1]，The larger the value, the stronger the reference intensity
        human_fidelity: 0.45, // Facial reference intensity, refers to the similarity of the facial features of the person in the reference image
                              // Only image_reference parameter is subject is available
                              // Value range：[0,1]，The larger the value, the stronger the reference intensity
        n: 1, //Number of generated images - Value range：[1,9]
        aspect_ratio: '16:9', // Aspect ratio of the generated images (width:height) - Enum values：16:9, 9:16, 1:1, 4:3, 3:4, 3:2, 2:3, 21:9
        callback_url: 'Your callback URL'
    },
    baseName: 'image',
    saveFolder: './klingAI/images',
};

export const klingAI_Vid_config = {
    KLING_AI_ENDPOINT: 'https://api-singapore.klingai.com/v1/videos/text2video',
    requestBody: {
        model_name: 'kling-v2-1-master',  // Enum values：kling-v1, kling-v1-5, kling-v2
        prompt: '',
        cfg_scale: '0.5',
        mode: 'std',
        duration: '10',
        aspect_ratio: '16:9', // Aspect ratio of the generated images (width:height) - Enum values：16:9, 9:16, 1:1, 4:3, 3:4, 3:2, 2:3, 21:9
        callback_url: 'Your callback URL'
    },
    baseName: 'video',
    saveFolder: './klingAI/videos',
}

export const klingAI_Img2Vid_Config = {
    KLING_AI_ENDPOINT: 'https://api-singapore.klingai.com/v1/videos/image2video',
    requestBody: {
        model_name: 'kling-v1',
        image: '',
        prompt: '',
        mode: 'std',
        duration: '10',
        cfg_scale: '0.5'
    },
    baseName: 'img2vid',
    saveFolder: './klingAI/img_to_videos'
}

export const klingAI_VidExtend_Config = {
    KLING_AI_ENDPOINT: 'https://api.klingai.com/v1/videos/video-extend',
    requestBody: {
        video_id: '',
        prompt: '',
        negative_prompt: '',
        cfg_scale: '',
        callback_url: ''
    },
    baseName: 'exd_vid',
    saveFolder: './klingAI/extended_videos'
}