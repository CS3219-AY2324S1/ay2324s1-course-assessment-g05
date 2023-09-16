const convertAllCapsToCamelCase = (str: string) => {
  const formatted = str.toLowerCase();
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
};

const convertEnumsToCamelCase = (obj: any) => {
  return Object.values(obj).map((item: any) => {
    return convertAllCapsToCamelCase(item);
  });
};

export const StringUtils = {
  convertAllCapsToCamelCase,
  convertEnumsToCamelCase,
};
