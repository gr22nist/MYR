import puppeteer from 'puppeteer';
import { decryptData } from '@/utils/cryptoUtils';
import QRCode from 'qrcode';

export default async function handler(req, res) {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    const resumeData = req.body;
    await page.setContent(await generateResumeHTML(resumeData));

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
    });

    await browser.close();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=resume.pdf');
    res.send(pdfBuffer);
  } catch (error) {
    console.error('PDF 생성 중 오류 발생:', error);
    res.status(500).json({ error: 'PDF 생성 중 오류가 발생했습니다.' });
  }
}

async function generateResumeHTML(data) {
  const sectionsHTML = await Promise.all(data.map(renderSection));
  return `
    <html>
      <head>
        <style>
          ${getStyles()}
        </style>
      </head>
      <body>
        <div id="resume-preview">
          ${sectionsHTML.join('')}
        </div>
      </body>
    </html>
  `;
}

function renderSection(section) {
  const decryptedData = decryptSection(section.data);

  switch (section.type) {
    case 'profile':
      return renderProfile(decryptedData);
    case 'userInfo':
      return renderUserInfo(decryptedData);
    case 'careers':
      return renderCareers(decryptedData);
    case 'educations':
      return renderEducations(decryptedData);
    case 'custom':
      return renderCustom(decryptedData);
    default:
      return '';
  }
}

function renderProfile(data) {
  return `
    <div class="profile-container">
      <div class="profile-title">
        <p class="profile-text-area-title leading-normal">
          ${renderWithLineBreaks(data.profileData?.title || '')}
        </p>
        ${data.profilePhoto && data.profilePhoto.value ? `
          <div class="w-[110px] h-[144px] relative">
            <img src="${data.profilePhoto.value}" alt="Profile" style="object-fit: cover; width: 100%; height: 100%;" />
          </div>
        ` : ''}
      </div>
      <div class="profile-text-area-paragraph">
        ${renderWithLineBreaks(data.profileData?.paragraph)}
      </div>
    </div>
  `;
}

function renderUserInfo(data) {
  return `
    <div class="user-info-container">
      <h2 class="section-title">기본 정보</h2>
      <div class="user-info-grid">
        ${data.map(info => {
          let displayValue, displayType;
          if (typeof info.value === 'object' && info.value !== null) {
            if (info.type === 'custom') {
              displayType = info.value.title;
              displayValue = info.value.value;
            } else {
              displayType = info.value.displayType || info.type;
              displayValue = info.value.value;
            }
          } else {
            displayType = info.displayType || info.type;
            displayValue = info.value;
          }
          if (typeof displayValue === 'object' && displayValue !== null) {
            displayValue = displayValue.value || JSON.stringify(displayValue);
          }
          return `
            <div class="user-info-item flex flex-col">
              <span class="user-info-label font-bold mb-1">${displayType || '정보'}</span>
              <span class="user-info-value">
                ${renderWithLineBreaks(displayValue)}
              </span>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
}

function renderCareers(data) {
  return `
    <div class="careers-section">
      <h2 class="section-title">경력</h2>
      ${data.map(career => `
        <div class="career-item">
          <h3 class="company-name">${career.value?.companyName || '회사명 없음'}</h3>
          <p class="position">${career.value?.position || '직책 없음'}</p>
          <p class="date-range">
            ${career.value?.startDate || '시작일 없음'} - ${career.value?.isCurrent ? '현재' : (career.value?.endDate || '종료일 없음')}
          </p>
          <div class="main-tasks">
            ${renderWithLineBreaks(career.value?.mainTask || '주요 업무 내용 없음')}
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

function renderEducations(data) {
  return `
    <div class="educations-section">
      <h2 class="section-title">학력</h2>
      ${data.map(education => `
        <div class="education-item">
          <h3 class="school-name">${education.value?.schoolName || '학교명 없음'}</h3>
          <p class="major">${education.value?.major || '전공 없음'}</p>
          <p class="date-range">
            ${education.value?.startDate || '시작일 없음'} - ${education.value?.isCurrent ? '현재' : (education.value?.endDate || '종료일 없음')}
          </p>
          <p class="graduation-status">${education.value?.graduationStatus || '졸업 상태 없음'}</p>
        </div>
      `).join('')}
    </div>
  `;
}

function renderCustom(data) {
  const customData = data.value;
  return `
    <div class="custom-section">
      <h2 class="section-title">${customData.title || '제목 없음'}</h2>
      ${customData.type === 'link' ? `
        <div class="link-items">
          ${(customData.links || []).map(link => `
            <a href="${link.link}" target="_blank" rel="noopener noreferrer" class="link-item">
              ${link.siteName}
            </a>
          `).join('')}
        </div>
      ` : `
        <div class="custom-content">
          ${renderWithLineBreaks(customData.content || '')}
        </div>
      `}
    </div>
  `;
}

function decryptSection(section) {
  if (Array.isArray(section)) {
    return section.map((item) => ({
      ...item,
      value: item.value ? decryptData(item.value) : null,
    }));
  }
  if (typeof section === 'object' && section !== null) {
    const decryptedSection = {};
    Object.keys(section).forEach((key) => {
      if (key === 'profilePhoto') {
        decryptedSection[key] = section[key];
      } else if (key === 'value' && typeof section[key] === 'string') {
        try {
          const decryptedValue = decryptData(section[key]);
          decryptedSection[key] = typeof decryptedValue === 'object' ? decryptedValue : JSON.parse(decryptedValue);
        } catch (error) {
          console.error('Failed to parse decrypted data:', error);
          decryptedSection[key] = decryptData(section[key]);
        }
      } else if (typeof section[key] === 'object' && section[key] !== null) {
        decryptedSection[key] = section[key].value ? decryptData(section[key].value) : null;
      } else {
        decryptedSection[key] = section[key];
      }
    });
    return decryptedSection;
  }
  return section;
}

function renderWithLineBreaks(text) {
  if (!text) return '';
  if (typeof text !== 'string') {
    text = JSON.stringify(text);
  }
  return text.split('\n').join('<br>');
}

// function getStyles() {
//   return `
//     .user-info-container {
//       margin-bottom: 2rem;
//     }
    
//     .section-title {
//       font-size: 1.5rem;
//       font-weight: bold;
//       margin-bottom: 1rem;
//     }
    
//     .user-info-grid {
//       display: grid;
//       grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
//       gap: 1rem;
//     }
    
//     .user-info-item {
//       background-color: #f5f5f5;
//       padding: 0.5rem;
//       border-radius: 4px;
//     }
    
//     .user-info-label {
//       font-weight: bold;
//       margin-right: 0.5rem;
//     }
    
//     .user-info-value {
//       word-break: break-word;
//     }
    
//     .careers-section {
//       margin-bottom: 2rem;
//     }
    
//     .career-item {
//       margin-bottom: 1.5rem;
//       padding-bottom: 1rem;
//       border-bottom: 1px solid #eaeaea;
//     }
    
//     .company-name {
//       font-weight: bold;
//       font-size: 1.1rem;
//       margin-bottom: 0.5rem;
//     }
    
//     .position {
//       color: #555;
//       margin-bottom: 0.25rem;
//     }
    
//     .date-range {
//       font-style: italic;
//       color: #777;
//       margin-bottom: 0.5rem;
//     }
    
//     .main-tasks {
//       white-space: pre-wrap;
//     }
    
//     .link-section {
//       margin-bottom: 1rem;
//     }
    
//     .link-items {
//       display: flex;
//       flex-wrap: wrap;
//       gap: 0.5rem;
//     }
    
//     .link-item {
//       background-color: #f0f0f0;
//       padding: 0.25rem 0.5rem;
//       border-radius: 9999px;
//       text-decoration: none;
//       color: #333;
//       font-size: 0.875rem;
//     }
    
//     .link-item:hover {
//       background-color: #e0e0e0;
//     }
    
//     .custom-section {
//       margin-bottom: 1rem;
//     }
    
//     .section-title {
//       font-size: 1.25rem;
//       font-weight: bold;
//       margin-bottom: 0.5rem;
//     }
    
//     .custom-content {
//       white-space: pre-wrap;
//     }
    
//     .action-buttons {
//       display: flex;
//       justify-content: space-between;
//       margin-bottom: 20px;
//     }
    
//     .back-btn, .pdf-export-btn {
//       padding: 10px 20px;
//       background-color: #007bff;
//       color: white;
//       border: none;
//       border-radius: 5px;
//       cursor: pointer;
//       text-decoration: none;
//       font-size: 16px;
//     }
    
//     .back-btn:hover, .pdf-export-btn:hover {
//       background-color: #0056b3;
//     }
//   `;
// }
