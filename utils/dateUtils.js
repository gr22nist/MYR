// 날짜 형식을 'YY.MM' 형태로 포맷팅하는 함수
export const formatDate = (date) => {
  if (!date) return '';
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  return `${year}.${month}`;
};

// 문자열을 Date 객체로 변환하는 함수
export const parseDate = (dateString) => {
  if (!dateString) return null;
  const [year, month] = dateString.split('.');
  return new Date(parseInt(`20${year}`, 10), parseInt(month, 10) - 1);
};

// 날짜 순서가 유효한지 확인하는 함수
export const isValidDateOrder = (startDate, endDate) => {
  if (!startDate || !endDate) return true;
  const start = parseDate(startDate);
  const end = parseDate(endDate);
  return start <= end;
};

// 입력된 날짜 문자열이 유효한지 확인하는 함수
export const isValidDateString = (dateString) => {
  if (!dateString) return true;
  const regex = /^(\d{2})\.(\d{2})$/;
  if (!regex.test(dateString)) return false;
  
  const [, year, month] = dateString.match(regex);
  const numYear = parseInt(year, 10);
  const numMonth = parseInt(month, 10);
  
  return numMonth >= 1 && numMonth <= 12;
};

// 날짜 입력값을 검증하고 포맷팅하는 함수
export const validateAndFormatDate = (dateString) => {
  if (!dateString) return '';
  if (!isValidDateString(dateString)) return dateString;
  
  const [year, month] = dateString.split('.');
  return `${year.padStart(2, '0')}.${month.padStart(2, '0')}`;
};
