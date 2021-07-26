// @flow
export function toHex(str: string): string {
  let s = unescape(encodeURIComponent(str));
  let result = '';
  for (let i = 0; i < s.length; i++) {
    result += s.charCodeAt(i).toString(16).padStart(2, '0');
  }

  return result;
}
