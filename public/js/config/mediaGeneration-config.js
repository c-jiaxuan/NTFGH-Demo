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
                    en: "e.g., red umbrella, old book, glass lantern",
                    zh: "例如：红伞、旧书、玻璃灯笼"
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
                    en: "e.g., quiet library, foggy street, sunny meadow",
                    zh: "例如：安静的图书馆、雾蒙蒙的街道、阳光草地"
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
                    en: "e.g., dog barking, leaves falling, child reading",
                    zh: "例如：狗叫、落叶、孩子在看书"
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
                zh: "主题",
                placeholder: {
                    en: "e.g., a lion, a ballerina, a racing car",
                    zh: "例如：一只狮子、一位芭蕾舞者、一辆赛车"
                }
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
                zh: "动作",
                placeholder: {
                    en: "e.g., running, spinning, jumping, dancing",
                    zh: "例如：奔跑、旋转、跳跃、舞蹈"
                }
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
                zh: "背景",
                placeholder: {
                    en: "e.g., a city skyline, a snowy mountain, an underwater reef",
                    zh: "例如：城市天际线、雪山、水下珊瑚礁"
                }
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
                zh: "背景动作",
                placeholder: {
                    en: "e.g., waves crashing, cars passing, leaves blowing",
                    zh: "例如：海浪拍打、车辆经过、树叶飘动"
                }
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
                zh: "镜头运动",
                placeholder: {
                    en: "e.g., panning left, zooming in, tracking shot",
                    zh: "例如：向左摇镜、拉近镜头、跟拍"
                }
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
                zh: "提示语",
                placeholder: {
                    en: "e.g., cinematic style, slow motion, dramatic lighting",
                    zh: "例如：电影风格、慢动作、戏剧化灯光"
                }
            }
        ],
        input: "additional"
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
                zh: "参考图像",
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
                zh: "主题",
                placeholder: {
                    en: "e.g., a dog, a mountain climber, a spaceship",
                    zh: "例如：一只狗、一位登山者、一艘宇宙飞船"
                }
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
                zh: "动作",
                placeholder: {
                    en: "e.g., walking, waving, swimming, flying",
                    zh: "例如：行走、挥手、游泳、飞行"
                }
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
                zh: "背景",
                placeholder: {
                    en: "e.g., a desert landscape, a futuristic city, a coral reef",
                    zh: "例如：沙漠景观、未来城市、珊瑚礁"
                }
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
                zh: "背景动作",
                placeholder: {
                    en: "e.g., birds flying, water flowing, clouds drifting",
                    zh: "例如：鸟儿飞翔、水流动、云朵飘动"
                }
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
                zh: "镜头运动",
                placeholder: {
                    en: "e.g., dolly zoom, tilting up, circling around",
                    zh: "例如：推拉变焦、向上倾斜、环绕拍摄"
                }
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
                zh: "提示语",
                placeholder: {
                    en: "e.g., anime style, high frame rate, warm lighting",
                    zh: "例如：动漫风格、高帧率、暖色灯光"
                }
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
        type: "selection",
        question: {
            en: "What is the language of the video?",
            zh: "视频的语言是什么？"
        },
        options: [
            {en: "English", zh: "英语", value: 'en'},
            {en: "Chinese", zh: "中文", value: 'zh'},
            {en: "Malay", zh: "马来语", value: 'ms'},
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
                zh: "目的",
                placeholder: {
                    en: "e.g., education, marketing, explanation, entertainment",
                    zh: "例如：教育、营销、讲解、娱乐"
                }
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
                zh: "观众",
                placeholder: {
                    en: "e.g., students, professionals, general public",
                    zh: "例如：学生、专业人士、公众"
                }
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
                zh: "语气",
                placeholder: {
                    en: "e.g., formal, casual, cheerful, serious",
                    zh: "例如：正式、随意、愉快、严肃"
                }
            }
        ],
        input: "tone"
    },
    {
        type: "selection",
        question: {
            en: "What type of media should be used?",
            zh: "应使用哪种类型的媒体？"
        },
        options: [
            {en: "Search", zh: "搜索", value: 'search'},
            {en: "Free", zh: "免费", value: 'free'},
            {en: "Premium", zh: "付费", value: 'premium'},
            {en: "Generative", zh: "生成性", value: 'generative'},
        ],
        input: "media"
    },
    {
        type: "selection",
        question: {
            en: "Enable high-definition AI media? (only if media is generative)",
            zh: "启用高清AI媒体? (仅限媒体类型为 generative)"
        },
        options: [
            {en: "Yes", zh: "是", value: true},
            {en: "No", zh: "否", value: false},
            {en: "Skip", zh: "跳过", value: null}
        ],
        input: "useGenerativeHighQuality"
    },
    {
        type: "selection",
        question: {
            en: "What is the visual style? (only for generative media)",
            zh: "视觉风格是什么？（仅适用于生成媒体）"
        },
        options: [
            {en: "Realistic", zh: "写实风格", value: 'realistic'},
            {en: "Digital Painting", zh: "数字绘画", value: 'digitalPainting'},
            {en: "Sketch", zh: "素描画风", value: 'sketch'},
            {en: "Oil Painting", zh: "油画风格", value: 'oilPainting'},
            {en: "Pixel Art", zh: "像素艺术", value: 'pixelArt'},
            {en: "Water Color", zh: "水彩画风", value: 'watercolor'},
            {en: "Low Poly", zh: "低多边形艺术", value: 'lowPoly'},
            {en: "Cyberpunk", zh: "赛博朋克风", value: 'cyberpunk'},
            {en: "Fantasy", zh: "奇幻风格", value: 'fantasy'},
            {en: "Anime", zh: "日系动漫风", value: 'anime'},
            {en: "Skip", zh: "跳过", value: null}
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
        type: "selection",
        question: {
            en: "What is the language of the video?",
            zh: "视频的语言是什么？"
        },
        options: [
            {en: "English", zh: "英语", value: 'en'},
            {en: "Chinese", zh: "中文", value: 'zh'},
            {en: "Malay", zh: "马来语", value: 'ms'},
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
                zh: "目的",
                placeholder: {
                    en: "e.g., education, marketing, explanation, entertainment",
                    zh: "例如：教育、营销、讲解、娱乐"
                }
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
                zh: "观众",
                placeholder: {
                    en: "e.g., students, professionals, general public",
                    zh: "例如：学生、专业人士、公众"
                }
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
                zh: "语气",
                placeholder: {
                    en: "e.g., formal, casual, cheerful, serious",
                    zh: "例如：正式、随意、愉快、严肃"
                }
            }
        ],
        input: "tone"
    },
    {
        type: "selection",
        question: {
            en: "What type of media should be used?",
            zh: "应使用哪种类型的媒体？"
        },
        options: [
            {en: "Search", zh: "搜索", value: 'search'},
            {en: "Free", zh: "免费", value: 'free'},
            {en: "Premium", zh: "付费", value: 'premium'},
            {en: "Generative", zh: "生成性", value: 'generative'},
        ],
        input: "media"
    },
    {
        type: "selection",
        question: {
            en: "Enable high-definition AI media? (only if media is generative)",
            zh: "启用高清AI媒体? (仅限媒体类型为 generative)"
        },
        options: [
            {en: "Yes", zh: "是", value: true},
            {en: "No", zh: "否", value: false},
            {en: "Skip", zh: "跳过", value: null}
        ],
        input: "useGenerativeHighQuality"
    },
    {
        type: "selection",
        question: {
            en: "What is the visual style? (only for generative media)",
            zh: "视觉风格是什么？（仅适用于生成媒体）"
        },
        options: [
            {en: "Realistic", zh: "写实风格", value: 'realistic'},
            {en: "Digital Painting", zh: "数字绘画", value: 'digitalPainting'},
            {en: "Sketch", zh: "素描画风", value: 'sketch'},
            {en: "Oil Painting", zh: "油画风格", value: 'oilPainting'},
            {en: "Pixel Art", zh: "像素艺术", value: 'pixelArt'},
            {en: "Water Color", zh: "水彩画风", value: 'watercolor'},
            {en: "Low Poly", zh: "低多边形艺术", value: 'lowPoly'},
            {en: "Cyberpunk", zh: "赛博朋克风", value: 'cyberpunk'},
            {en: "Fantasy", zh: "奇幻风格", value: 'fantasy'},
            {en: "Anime", zh: "日系动漫风", value: 'anime'},
            {en: "Skip", zh: "跳过", value: null}
        ],
        input: "style"
    }
];
