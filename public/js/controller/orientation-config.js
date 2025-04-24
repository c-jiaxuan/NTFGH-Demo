export const steps = [
  {
    title: 'Care Team',
    translations: {
      zh: { title: '护理团队' }
    },
    substeps: [
      {
        title: 'Introduction',
        type: 'video',
        src: './vid/care-team-intro.mp4',
        avatarSpeech: '',
        translations: {
          zh: {
            title: '介绍',
            avatarSpeech: '',
          }
        }
      },
      {
        title: 'Use of Two-patient Identifiers',
        type: 'text-image',
        content: `You will be given a wristband to verify your identity. To ensure you receive the right treatment at the right place and at the right time, we will ask for your name and NRIC/FIN/Passport no. at the following interactions:
            <ul>
                <li>During registration/discharge/transfer</li>
                <li>Before being examined/treated/given medications or blood products</li>
                <li>Before specimen collection</li>
                <li>When we issue documents to you</li>
            </ul>`,
        imgSrc: './img/orientation/ID_Card.png',
        avatarSpeech: 'Here’s how we verify your identity using two identifiers.',
        translations: {
          zh: {
            title: '使用双重身份验证',
            content: `您将获得一个腕带用于核实身份。为了确保您在正确的时间和地点接受正确的治疗，我们将在以下情况下向您确认姓名和身份证号码（NRIC/FIN/护照）：
<ul>
  <li>在登记、出院或转院时</li>
  <li>在接受检查、治疗、用药或输血制品前</li>
  <li>在采集样本前</li>
  <li>在我们向您发放文件时</li>
</ul>
`,
            avatarSpeech: '以下是我们如何通过两个验证项目确认您的身份。',
          }
        }
      },
      {
        type: 'quiz',
        title: 'Do you have your wristband?',
        content: {
          image: '',
          options: [
            { text: 'Yes', translations: { zh: '是' }, correct: true, response: '', nextQns: true },
            { text: 'No', translations: { zh: '否' }, correct: false, response: '', nextQns: false }
          ]
        },
        avatarSpeech: 'Do you have your wristband?',
        translations: {
          zh: {
            title: '您有腕带吗？',
            avatarSpeech: '您有佩戴腕带吗？',
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
    title: 'Nurse Call System',
    translations: {
      zh: { title: '护士呼叫系统' }
    },
    substeps: [
      {
        title: 'Nurse Call System Video',
        type: 'video',
        src: './vid/nurse-call-system.mov',
        avatarSpeech: '',
        translations: {
          zh: {
            title: '护士呼叫系统视频',
            avatarSpeech: '',
          }
        }
      },
      {
        type: 'quiz',
        title: 'Which button do you press to call the nurse for help?',
        content: {
          image: '',
          options: [
            { text: 'Red Button', translations: { zh: '红色按钮' }, correct: true, response: '', nextQns: false },
            { text: 'Right Button', translations: { zh: '右侧按钮' }, correct: false, response: '', nextQns: false },
            { text: 'Left Button', translations: { zh: '左侧按钮' }, correct: false, response: '', nextQns: false }
          ]
        },
        avatarSpeech: 'Which button do you press to call the nurse?',
        translations: {
          zh: {
            title: '您按哪个按钮呼叫护士？',
            avatarSpeech: '您知道该按哪个按钮呼叫护士吗？',
          }
        }
      }
    ]
  },
  {
    title: 'Visitation Policy',
    translations: {
      zh: { title: '探访政策' }
    },
    substeps: [
      {
        title: 'Visiting Hours',
        type: 'text',
        content: `The main visiting hours are:<br> 
          <u>Daily:</u>
          12:00PM - 08:00PM
          <br><br>
          Visistors are required to register before entering the wards
          <br> 
          <b>Visitor Management Kiosks</b><br>
          Levels 1 and 2, Tower B
          <br> 
          <b> Visitor Registration Counter</b><br>
          Level 1, Tower B`,
        avatarSpeech: 'Let’s go over the visiting hours and registration process.',
        translations: {
          zh: {
            title: '探访时间',
            content: `主要探访时间如下：<br> 
<u>每日：</u>
中午12:00 至 晚上8:00
<br><br>
进入病房前，所有访客必须完成登记
<br> 
<b>访客管理自助服务终端</b><br>
Tower B，第一层与第二层
<br> 
<b>访客登记柜台</b><br>
Tower B，第一层
`,
            avatarSpeech: '现在介绍探访时间和登记流程。',
          }
        }
      },
      {
        title: 'Visitation Policy',
    translations: {
      zh: { title: '探访政策' }
    },
        type: 'text',
        content: `First time visitors must register once for the duration of the patient's stay.
            <br>
            <u>Self-Registration</u><br>
            Singaporeans and PRs with an NRIC, Singapore Driving Licence, or Student/Senior EZ-link card can self-register at Visitor Management Kiosks (Level 1&2, Tower B). You'll need the patient's full name, ward (e.g. B5), and bed number.
            <br>
            <img src="./img/orientation/Nametag.png" style="max-height: 130px;"></img>
            <u>Assisted Registration</u><br>
            If you don't have the required info or documents, register at the Visitor Registration Counter (Level 1, Tower B). After registration, scan you NRIC or registation label at the Level 1 gantry to enter the ward.`,
        avatarSpeech: 'Here’s how visitors can register and enter the wards.',
        translations: {
          zh: {
            title: '探访政策',
            content: `首次来访者在病人住院期间只需注册一次。
<br>
<u>自助登记</u><br>
拥有新加坡身份证、驾驶执照，或学生/乐龄EZ-link卡的新加坡公民和永久居民，可在访客管理自助服务终端（Tower B，一楼和二楼）自助登记。您需要提供病人的全名、病房（如B5）和床号。
<br>
<img src="./img/orientation/Nametag.png" style="max-height: 130px;"></img>
<u>协助登记</u><br>
如果您没有所需的信息或文件，请前往访客登记柜台（Tower B，一楼）进行登记。登记后，请在一楼闸口扫描您的身份证或登记标签以进入病房。
`,
            avatarSpeech: '以下是访客如何注册和进入病房的方法。',
          }
        }
      },
      {
        title: 'Visitation Policy',
    translations: {
      zh: { title: '探访政策' }
    },
        type: 'text',
        content: ` <img src="./img/orientation/Visiting_policy.png" style="max-height: 130px;"></img>
          <ul>
            <li>Two members of the family (apart from the four visitors) may register as caregivers. Caregivers may enter the wards at any time to assist with the care of the patient. Visiting hours will not apply.</li>
            <li>A maximum of two visitors are allowed into other areas such as the Isolation Ward, Kidney Unit, Ambulatory Unit and Endoscopy at any one time during visiting horus.</li>`,
        avatarSpeech: 'Here are the policies for caregivers and special units.',
        translations: {
          zh: {
            title: '探访政策',
            content: `<img src="./img/orientation/Visiting_policy.png" style="max-height: 130px;"></img>
<ul>
  <li>家庭成员中最多可有两人（不包括四名访客）注册为护理人员。护理人员可以在任何时间进入病房，协助照顾病人，探访时间不受限制。</li>
  <li>在探访时间内，隔离病房、肾脏科、门诊治疗部及内窥镜室等区域最多允许两名访客同时进入。</li>
</ul>`,
            avatarSpeech: '以下是护理人员和特殊区域的探访政策。',
          }
        }
      }
    ]
  },
  {
    title: 'Fall Precaution',
    translations: {
      zh: { title: '防跌倒' }
    },
    substeps: [
      {
        title: 'Fall Precaution Video',
        type: 'video',
        src: './vid/fall-precaution.mp4',
        avatarSpeech: '',
        translations: {
          zh: {
            title: '防跌倒视频',
            avatarSpeech: '',
          }
        }
      },
      {
        title: 'Fall Precaution QR',
        type: 'image',
        src: './img/orientation/fall-precaution.jpg',
        avatarSpeech: 'Scan this QR code for fall precaution tips.',
        translations: {
          zh: {
            title: '防跌倒二维码',
            avatarSpeech: '扫描此二维码了解防跌提示。',
          }
        }
      }
    ]
  }
];
