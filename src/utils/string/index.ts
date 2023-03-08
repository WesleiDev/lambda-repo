export const paramCase = (param: string): string => {
  return param.toLocaleLowerCase().split(' ').join('-');
};
