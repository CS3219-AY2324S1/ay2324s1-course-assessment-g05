const convertAllCapsToCamelCase = (str: string) => {
  const formatted = str.toLowerCase();
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
};

const convertEnumsToCamelCase = (obj: any) => {
  if (!obj) return [];
  return Object.values(obj).map((item: any) => {
    return convertAllCapsToCamelCase(item);
  });
};

const convertStringToCamelCase = (str: string) => {
  const words = str.split(" ");
  let formatted = "";
  words.forEach((word, index) => {
    if (index > 0) {
      formatted += word[0].toUpperCase() + word.slice(1).toLowerCase();
    } else {
      formatted = word.toLowerCase();
    }
  });
  return formatted;
};

export const StringUtils = {
  convertAllCapsToCamelCase,
  convertEnumsToCamelCase,
  convertStringToCamelCase,
};
