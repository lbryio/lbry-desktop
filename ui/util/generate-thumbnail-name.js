// @flow
export const generateThumbnailName = (): string => {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 24; i += 1) text += possible.charAt(Math.floor(Math.random() * 62));
  return text;
};
