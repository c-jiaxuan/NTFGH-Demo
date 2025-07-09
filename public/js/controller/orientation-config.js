export const steps = [
  {
    title: 'Team',
    translations: {
      zh: { title: '护理团队' }
    },
    substeps: [
      {
        title: 'Introduction',
        type: 'video',
        src: './vid/step1-1.mp4',
        avatarSpeech: '',
        translations: {
          zh: {
            title: '介绍',
            avatarSpeech: '',
          }
        }
      },
      {
        title: 'Use of ID Badges',
        type: 'text-image',
        content: `You will be given a company-issued ID badge to verify your identity. To ensure you receive the correct services at the appropriate time and location, we will ask for your name and official identification (e.g., NRIC/FIN/Passport number) during the following interactions:
            <ul> 
              <li>During onboarding, department transfer, or offboarding</li>
              <li>Before accessing restricted areas or receiving company assets/services</li>
              <li>Before submitting or collecting official documents or materials</li>
              <li>When issuing official correspondence or certifications</li>
            </ul>`,
        imgSrc: './img/orientation/ID_Card.png',
        avatarSpeech: 'Here’s how we verify your identity using ID Badges.',
        translations: {
          zh: {
            title: '使用ID徽章',
            content: `您将获得一张公司发放的识别证，以便核实您的身份。为了确保您在正确的时间和地点获得相应的服务，我们将在以下情境中要求您提供姓名和有效身份证明（如身份证/外国人身份证/护照号码）：
                <ul>
                  <li>在入职、部门调动或离职时</li>
                  <li>在进入受限区域或领取公司资产/服务前</li>
                  <li>在提交或领取官方文件或资料前</li>
                  <li>在发放官方信函或证明文件时</li>
                </ul>`,
            avatarSpeech: '以下是我们如何通过ID徽章确认您的身份。',
          }
        }
      },
      {
        type: 'quiz',
        title: 'Do you have your ID Badge?',
        content: {
          image: '',
          options: [
            { text: 'Yes', translations: { zh: '是' }, correct: true, response: '', nextQns: true },
            { text: 'No', translations: { zh: '否' }, correct: false, response: '', nextQns: false }
          ]
        },
        avatarSpeech: 'Do you have your ID Badge?',
        translations: {
          zh: {
            title: '您有ID徽章吗？',
            avatarSpeech: '您有ID徽章吗？',
          }
        }
      },
      {
        type: 'quiz',
        title: 'Is it the correct name and ID number?',
        content: {
          image: '',
          options: [
            { text: 'Yes', translations: { zh: '是' }, correct: true, response: '', nextQns: false },
            { text: 'No', translations: { zh: '否' }, correct: false, response: '', nextQns: false }
          ]
        },
        avatarSpeech: 'Is your name and ID number correct?',
        translations: {
          zh: {
            title: '您的姓名和身份证号码正确吗？',
            avatarSpeech: '请确认您的姓名和身份证号码是否正确。',
          }
        }
      }
    ]
  },
  {
    title: 'Visitor Access Policy',
    translations: {
      zh: { title: '访客访问政策' }
    },
    substeps: [
      {
        title: 'General Visiting Hours',
        type: 'text',
        content: `Standard visiting hours for guests and external personnel:<br> 
    <u>Daily:</u> 09:00AM - 06:00PM
    <br><br>
    All visitors must complete registration before entering work areas.
    <br> 
    <b>Self-Service Kiosks</b><br>
    Located on Levels 1, Building A
    <br> 
    <b>Visitor Registration Counter</b><br>
    Level 1, Building A`,
        avatarSpeech: 'Let’s go over the visitor hours and registration process.',
        translations: {
          zh: {
            title: '访客时间',
            content: `访客和外来人员的标准访问时间如下：<br> 
    <u>每日：</u> 上午09:00 至 晚上06:00
    <br><br>
    所有访客在进入办公区域前需完成登记。
    <br> 
    <b>访客自助登记终端</b><br>
    Building A，第一层
    <br> 
    <b>访客登记柜台</b><br>
    Building A，第一层`,
            avatarSpeech: '现在介绍访客时间和登记流程。',
          }
        }
      },
      {
        title: 'Visitor Registration Process',
        translations: {
          zh: { title: '访客登记流程' }
        },
        type: 'text',
        content: `All first-time visitors must register once per visit period.
    <br>
    <u>Self-Registration</u><br>
    Visitors with valid government-issued IDs (e.g. ID card, driver’s license, or staff-access cards) may use the Self-Service Kiosks (Level 1, Building A). Required info includes host's name, department (e.g. D5), and purpose of visit.
    <br>
    <img src="./img/orientation/Nametag.png" style="max-height: 130px;"></img>
    <u>Assisted Registration</u><br>
    If unable to self-register, visitors may proceed to the Registration Counter (Level 1, Building A). After registering, scan your ID or issued label at the access gate to enter.`,
        avatarSpeech: 'Here’s how guests can register and access the premises.',
        translations: {
          zh: {
            title: '访客登记流程',
            content: `所有首次访客在访问期间只需登记一次。
    <br>
    <u>自助登记</u><br>
    持有有效身份证件（如身份证、驾驶执照或员工卡）的访客，可在自助终端机（Building A，一楼）登记。需提供接待人员的姓名、部门（如 D5）和访问目的。
    <br>
    <img src="./img/orientation/Nametag.png" style="max-height: 130px;"></img>
    <u>协助登记</u><br>
    如无法自助登记，请前往访客登记柜台（Building A，一楼）。登记完成后，请在闸口扫描您的身份证或登记标签以进入办公区域。`,
            avatarSpeech: '以下是访客如何完成登记和进入办公区域的方法。',
          }
        }
      },
      {
        title: 'Access Guidelines',
        translations: {
          zh: { title: '访问指南' }
        },
        type: 'text',
        content: `<img src="./img/orientation/Visiting_policy.png" style="max-height: 130px;"></img>
    <ul>
      <li>Two individuals may be pre-registered as authorized assistants (beyond the standard guest count). These assistants can access secure areas anytime for support-related tasks. Time restrictions do not apply.</li>
      <li>Restricted areas (e.g. server rooms, labs, executive zones) allow a maximum of two guests at a time during official visiting hours.</li>
    </ul>`,
        avatarSpeech: 'Let’s cover access policies for support personnel and restricted zones.',
        translations: {
          zh: {
            title: '访问指南',
            content: `<img src="./img/orientation/Visiting_policy.png" style="max-height: 130px;"></img>
    <ul>
      <li>除了标准访客人数，最多可提前注册两位授权协助人员。这些人员可在任何时间进入受限区域以协助相关工作，访问时间不受限制。</li>
      <li>在正式访客时间内，受限区域（如服务器机房、实验室、高管办公区）最多允许两位访客同时进入。</li>
    </ul>`,
            avatarSpeech: '以下是协助人员和受限区域的访问政策。',
          }
        }
      }
    ]
  }
];
