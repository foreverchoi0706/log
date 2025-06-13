export const isKoreanAddressRegex = (value: string) =>
  /(시|군|구)\s*[^\d\s]{1,20}(동|읍|면|리)?/.test(value);

const isFloat = (number: number) => Number.isFinite(number) && number % 1 !== 0;

export const isLatitude = (value: string | number) => {
  const number = Number(value);
  return isFloat(number) && number >= 33 && number <= 38;
};

export const isLongitude = (value: string | number) => {
  const number = Number(value);
  return isFloat(number) && number >= 124 && number <= 132;
};
