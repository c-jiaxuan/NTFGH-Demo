export const text2Img_steps = [
    {
        type: "prompt",
        question: {
            en: "What are the objects present?",
            zh: "有哪些物品在场？"
        },
        fields: [
            {
                en: "Objects present",
                zh: "物品"
            }
        ],
        input: "object"
    },
    {
        type: "prompt",
        question: {
            en: "Describe the environment:",
            zh: "描述环境："
        },
        fields: [
            {
                en: "Environment",
                zh: "环境"
            }
        ],
        input: "environment"
    },
    {
        type: "prompt",
        question: {
            en: "What actions are taking place?",
            zh: "进行中的动作？"
        },
        fields: [
            {
                en: "Actions",
                zh: "动作"
            }
        ],
        input: "action"
    },
    {
        type: "prompt",
        question: {
            en: "What time of day is it?",
            zh: "时间？"
        },
        fields: [
            {
                en: "Time",
                zh: "时间"
            }
        ],
        input: "time"
    },
    {
        type: "prompt",
        question: {
            en: "What is the mood / atmosphere?",
            zh: "气氛"
        },
        fields: [
            {
                en: "Mood",
                zh: "情绪"
            }
        ],
        input: "mood"
    },
    {
        type: "prompt",
        question: {
            en: "Any additional instructions or prompts?",
            zh: "其他说明"
        },
        fields: [
            {
                en: "Additional prompt",
                zh: "附加提示"
            }
        ],
        input: "additional"
    }
];

export const text2Vid_steps = [
    {
        type: "prompt",
        question: {
            en: "What is the main subject of the video?",
            zh: "视频的主要主题是什么？"
        },
        fields: [
            {
                en: "Subject",
                zh: "主题"
            }
        ],
        input: "subject"
    },
    {
        type: "prompt",
        question: {
            en: "What movement is the subject performing?",
            zh: "主体在执行什么动作？"
        },
        fields: [
            {
                en: "Movement",
                zh: "动作"
            }
        ],
        input: "movement"
    },
    {
        type: "prompt",
        question: {
            en: "What is the background or environment?",
            zh: "背景或环境是怎样的？"
        },
        fields: [
            {
                en: "Background",
                zh: "背景"
            }
        ],
        input: "background"
    },
    {
        type: "prompt",
        question: {
            en: "Is there any movement in the background?",
            zh: "背景中有什么动态？"
        },
        fields: [
            {
                en: "Background Movement",
                zh: "背景动作"
            }
        ],
        input: "BGMovement"
    },
    {
        type: "prompt",
        question: {
            en: "What camera motion should be used?",
            zh: "摄像机的移动方式是什么？"
        },
        fields: [
            {
                en: "Camera Motion",
                zh: "镜头运动"
            }
        ],
        input: "motion"
    },
    {
        type: "prompt",
        question: {
            en: "Any additional instructions or prompts?",
            zh: "其他说明或提示？"
        },
        fields: [
            {
                en: "Prompt",
                zh: "提示语"
            }
        ],
        input: "prompt"
    }
];

export const img2Vid_steps = [
    {
        type: "media",
        question: {
            en: "Upload a reference image to animate.",
            zh: "上传要动画化的参考图像。"
        },
        fields: [
            {
                en: "Reference Image",
                zh: "参考图像"
            }
        ],
        input: "image"
    },
    {
        type: "prompt",
        question: {
            en: "What is the main subject of the video?",
            zh: "视频的主要主题是什么？"
        },
        fields: [
            {
                en: "Subject",
                zh: "主题"
            }
        ],
        input: "subject"
    },
    {
        type: "prompt",
        question: {
            en: "What movement is the subject performing?",
            zh: "主体在执行什么动作？"
        },
        fields: [
            {
                en: "Movement",
                zh: "动作"
            }
        ],
        input: "movement"
    },
    {
        type: "prompt",
        question: {
            en: "What is the background or environment?",
            zh: "背景或环境是怎样的？"
        },
        fields: [
            {
                en: "Background",
                zh: "背景"
            }
        ],
        input: "background"
    },
    {
        type: "prompt",
        question: {
            en: "Is there any movement in the background?",
            zh: "背景中有什么动态？"
        },
        fields: [
            {
                en: "Background Movement",
                zh: "背景动作"
            }
        ],
        input: "BGMovement"
    },
    {
        type: "prompt",
        question: {
            en: "What camera motion should be used?",
            zh: "摄像机的移动方式是什么？"
        },
        fields: [
            {
                en: "Camera Motion",
                zh: "镜头运动"
            }
        ],
        input: "motion"
    },
    {
        type: "prompt",
        question: {
            en: "Any additional instructions or prompts?",
            zh: "其他说明或提示？"
        },
        fields: [
            {
                en: "Prompt",
                zh: "提示语"
            }
        ],
        input: "prompt"
    }
];

export const doc2vid_steps = [

];

export const url2vid_steps = [
    
];