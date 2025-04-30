export const steps = [
    {
      type: "assessment",
      question: {
        en: "What is your marital status?",
        zh: "您的婚姻状况是？"
      },
      options: [
        { en: "Single", zh: "单身" },
        { en: "Married", zh: "已婚" },
        { en: "Separated", zh: "分居" },
        { en: "Divorced", zh: "离婚" },
        { en: "Widowed", zh: "丧偶" },
        { en: "Unknown", zh: "未知" }
      ]
    },
    {
      type: "assessment",
      question: {
        en: "What is your religion?",
        zh: "您的宗教信仰是什么？"
      },
      options: [
        { en: "Buddhism", zh: "佛教" },
        { en: "Islam", zh: "伊斯兰教" },
        { en: "Hinduism", zh: "印度教" },
        { en: "Taoism", zh: "道教" },
        { en: "Free Thinker", zh: "自由思考者" },
        { en: "Christianity", zh: "基督教" },
        { en: "None", zh: "无" }
      ]
    },
    // {
    //   type: "adl",
    //   question: {
    //     en: "Do you need any help with meals or feeding?",
    //     zh: "您是否需要在进餐或喂食方面的协助？"
    //   },
    //   options: [
    //     { en: "Independant", zh: "独立" },
    //     { en: "Needs assistance", zh: "需要协助" },
    //     { en: "Dependant", zh: "完全依赖" },
    //     { en: "Unable to assess", zh: "无法评估" }
    //   ]
    // },
    // {
    //   type: "adl",
    //   question: {
    //     en: "Do you need any help with toileting/bathing?",
    //     zh: "您是否需要如厕或洗澡方面的协助？"
    //   },
    //   options: [
    //     { en: "Independant", zh: "独立" },
    //     { en: "Needs assistance", zh: "需要协助" },
    //     { en: "Dependant", zh: "完全依赖" },
    //     { en: "Unable to assess", zh: "无法评估" }
    //   ]
    // },
    {
      type: "next-of-kin",
      question: {
        en: "Please provide details for your next-of-kin.",
        zh: "请提供您的紧急联系人资料。"
      },
      fields: [
        { en: "Name", zh: "姓名" },
        { en: "Relationship", zh: "关系" },
        { en: "Address", zh: "地址" },
        { en: "Phone Number", zh: "电话号码" }
      ]
    }
  ];
  