export const txt2img_steps = [
    {
        type: "prompt",
        question: {
            en: "What are the objects present?",
            zh: "有哪些物品在场？"
        },
        fields: [
            {
                en: "Objects present",
                zh: "物品",
                placeholder: {
                    en: "e.g., a red apple, a wooden chair, a glass of water",
                    zh: "例如：一个红苹果、一把木椅子、一杯水"
                }
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
                zh: "环境",
                placeholder: {
                    en: "e.g., a cozy living room, a sunny beach, a dark forest",
                    zh: "例如：温馨的客厅、阳光明媚的海滩、幽暗的森林"
                }
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
                zh: "动作",
                placeholder: {
                    en: "e.g., a cat sleeping, waves crashing, a person painting",
                    zh: "例如：猫在睡觉、海浪拍打、一个人在画画"
                }
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
                zh: "时间",
                placeholder: {
                    en: "e.g., sunrise, midday, sunset, midnight",
                    zh: "例如：日出、正午、日落、午夜"
                }
            }
        ],
        input: "time"
    },
    {
        type: "prompt",
        question: {
            en: "What is the mood and atmosphere?",
            zh: "气氛"
        },
        fields: [
            {
                en: "Mood",
                zh: "情绪",
                placeholder: {
                    en: "e.g., peaceful, mysterious, cheerful, tense",
                    zh: "例如：宁静、神秘、愉快、紧张"
                }
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
                zh: "附加提示",
                placeholder: {
                    en: "e.g., in watercolor style, highly detailed, cinematic lighting",
                    zh: "例如：水彩风格、高度细节化、电影感灯光"
                }
            }
        ],
        input: "additional"
    }
];

export const txt2vid_steps = [
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

export const img2vid_steps = [
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
    {
        type: "document",
        question: {
            en: "Upload your document to generate a video",
            zh: "上传文档以生成视频"
        },
        fields: [
            {
                en: "Document Upload",
                zh: "上传文档"
            }
        ],
        input: "document"
    },
    {
        type: "prompt",
        question: {
            en: "What is the language of the video?",
            zh: "视频的语言是什么？"
        },
        fields: [
            {
                en: "Language",
                zh: "语言"
            }
        ],
        input: "language"
    },
    {
        type: "prompt",
        question: {
            en: "What is the objective of the video?",
            zh: "视频的目的是什么？"
        },
        fields: [
            {
                en: "Objective",
                zh: "目的"
            }
        ],
        input: "objective"
    },
    {
        type: "prompt",
        question: {
            en: "Who is the target audience?",
            zh: "目标观众是谁？"
        },
        fields: [
            {
                en: "Audience",
                zh: "观众"
            }
        ],
        input: "audience"
    },
    {
        type: "prompt",
        question: {
            en: "What tone should the video have?",
            zh: "视频应采用什么语气？"
        },
        fields: [
            {
                en: "Tone",
                zh: "语气"
            }
        ],
        input: "tone"
    },
    {
        type: "prompt",
        question: {
            en: "What type of media should be used?",
            zh: "应使用哪种类型的媒体？"
        },
        fields: [
            {
                en: "Media Type",
                zh: "媒体类型"
            }
        ],
        input: "media"
    },
    {
        type: "prompt",
        question: {
            en: "Enable high-definition AI media? (only if media is generative)",
            zh: "启用高清AI媒体？（仅限媒体类型为 generative）"
        },
        fields: [
            {
                en: "Use High Quality Generative Media",
                zh: "启用高清生成媒体"
            }
        ],
        input: "useGenerativeHighQuality"
    },
    {
        type: "prompt",
        question: {
            en: "What is the visual style? (only for generative media)",
            zh: "视觉风格是什么？（仅适用于生成媒体）"
        },
        fields: [
            {
                en: "Style",
                zh: "风格"
            }
        ],
        input: "style"
    }
];


export const url2vid_steps = [
    {
        type: "prompt",
        question: {
            en: "Enter the source URL for the video content",
            zh: "输入视频内容的来源链接"
        },
        fields: [
            {
                en: "Source URL",
                zh: "链接"
            }
        ],
        input: "url"
    },
    {
        type: "prompt",
        question: {
            en: "What is the language of the video?",
            zh: "视频的语言是什么？"
        },
        fields: [
            {
                en: "Language",
                zh: "语言"
            }
        ],
        input: "language"
    },
    {
        type: "prompt",
        question: {
            en: "What is the objective of the video?",
            zh: "视频的目的是什么？"
        },
        fields: [
            {
                en: "Objective",
                zh: "目的"
            }
        ],
        input: "objective"
    },
    {
        type: "prompt",
        question: {
            en: "Who is the target audience?",
            zh: "目标观众是谁？"
        },
        fields: [
            {
                en: "Audience",
                zh: "观众"
            }
        ],
        input: "audience"
    },
    {
        type: "prompt",
        question: {
            en: "What tone should the video have?",
            zh: "视频应采用什么语气？"
        },
        fields: [
            {
                en: "Tone",
                zh: "语气"
            }
        ],
        input: "tone"
    },
    {
        type: "prompt",
        question: {
            en: "What type of media should be used?",
            zh: "应使用哪种类型的媒体？"
        },
        fields: [
            {
                en: "Media Type",
                zh: "媒体类型"
            }
        ],
        input: "media"
    },
    {
        type: "prompt",
        question: {
            en: "Enable high-definition AI media (only if media is generative)?",
            zh: "启用高清AI媒体？（仅限媒体类型为 generative）"
        },
        fields: [
            {
                en: "Use High Quality Generative Media",
                zh: "启用高清生成媒体"
            }
        ],
        input: "useGenerativeHighQuality"
    },
    {
        type: "prompt",
        question: {
            en: "What is the visual style? (only for generative media)",
            zh: "视觉风格是什么？（仅适用于生成媒体）"
        },
        fields: [
            {
                en: "Style",
                zh: "风格"
            }
        ],
        input: "style"
    }
];
