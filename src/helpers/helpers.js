export function truncate(str = '', len = 30) {
  if (!str) return '';
  if (str.length <= len) return str;
  return str.slice(0, len - 3) + '...';
}
