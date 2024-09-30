export const PLACEHOLDERS = {
  career: {
    companyName: "예: 네이버 주식회사, Google",
    position: " 예: 소프트웨어 엔지니어, UX/UI 디자이너",
    tasks: `
· 담당 업무에 대해 간단한 서술형 문장으로 작성하시는 것을 추천드립니다.
· 프로젝트 단위의 업무가 흔한 직군이라면 대표 프로젝트에 대한 소개를 추가 해주세요.
· 업무의 성과나 숫자로 나타낼 수 있는 지표가 있다면 활용해보세요.
· 특별한 프로그램이나 사용기술이 있다면 경력기술서 열람에 도움이 됩니다.
`.trim()
  },
  
  education: {
    schoolName: "예: 서울대학교, Harvard University",
    majors: `
· 학점이나 긍정적인 특이사항, 교내 활동 등을 어필해보세요.
· 졸업논문이나 수상이력을 포함시키는 것도 좋습니다.
`.trim()
  },

    
  project: `
· 프로젝트명: 프로젝트의 이름을 입력하세요.
· 기간: 프로젝트 수행 기간을 입력하세요. (예: 2023.01 - 2023.06)
· 역할: 프로젝트에서 맡은 역할을 간단히 설명하세요.
· 주요 업무: 프로젝트에서 수행한 주요 업무를 bullet point로 나열하세요.
· 사용 기술: 프로젝트에서 사용한 기술 스택을 나열하세요.
· 결과: 프로젝트의 결과나 성과를 간단히 설명하세요.
`.trim(),

  award: `
· 수상명: 수상한 상의 이름을 입력하세요.
· 수여 기관: 상을 수여한 기관의 이름을 입력하세요.
· 수상 날짜: 수상한 날짜를 입력하세요. (예: 2023.05)
· 수상 내용: 수상 내용이나 의미를 간단히 설명하세요.
`.trim(),

  certification: `
· 자격증명: 취득한 자격증의 이름을 입력하세요.
· 발급 기관: 자격증을 발급한 기관의 이름을 입력하세요.
· 취득일: 자격증을 취득한 날짜를 입력하세요. (예: 2023.03)
· 유효 기간: 자격증의 유효 기간이 있다면 입력하세요. (예: 2023.03 - 2028.03)
`.trim(),

  language: `
· 언어: 구사할 수 있는 언어를 입력하세요.
· 수준: 해당 언어의 구사 수준을 입력하세요. (예: 유창함, 비즈니스 레벨, 일상 회화 가능 등)
· 시험 점수: 공인 언어 시험 점수가 있다면 입력하세요. (예: TOEIC 900점, JLPT N1 등)
· 취득일: 시험 점수를 취득한 날짜를 입력하세요. (예: 2023.06)
`.trim(),

  activity: `
· 활동명: 참여한 활동의 이름을 입력하세요.
· 기관/단체: 활동을 주관한 기관이나 단체의 이름을 입력하세요.
· 기간: 활동 기간을 입력하세요. (예: 2023.01 - 2023.12)
· 역할: 활동에서 맡은 역할을 간단히 설명하세요.
· 주요 내용: 활동의 주요 내용을 bullet point로 나열하세요.
· 성과: 활동을 통해 얻은 성과나 배운 점을 간단히 설명하세요.
`.trim(),

  default: `
· 제목: 항목의 제목을 입력하세요.
· 날짜/기간: 관련된 날짜나 기간을 입력하세요.
· 설명: 항목에 대한 자세한 설명을 입력하세요.
· 주요 내용: 중요한 내용을 bullet point로 나열하세요.
· 결과/성과: 관련된 결과나 성과가 있다면 설명하세요.
`.trim(),
};