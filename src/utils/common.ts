export const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .trim()
    .replace(/ /g, '-') // Thay khoảng trắng bằng dấu gạch ngang
    .replace(/[^\w-]+/g, ''); // Loại bỏ ký tự đặc biệt
};
