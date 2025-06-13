export const isKoreanAddressRegex = (value: string) =>
  /(서울|부산|대구|인천|광주|대전|울산|세종|경기|강원|충북|충남|전북|전남|경북|경남|제주)\s*(특별시|광역시|도)?\s*[^\d\s]{1,20}(시|군|구)\s*[^\d\s]{1,20}(동|읍|면|리)?/.test(
    value
  );

const isFloat = (number: number) => Number.isFinite(number) && number % 1 !== 0;

export const isLatitude = (value: string | number) => {
  const number = Number(value);
  return isFloat(number) && number >= 33 && number <= 38;
};

export const isLongitude = (value: string | number) => {
  const number = Number(value);
  return isFloat(number) && number >= 124 && number <= 132;
};
