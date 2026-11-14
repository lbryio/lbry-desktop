// Globals that webpack provides in the real app (ProvidePlugin / renderer env)
// but Jest's node environment doesn't.

// The i18n translation function: pass strings through, substituting %tokens%.
global.__ = (str, params) => {
  if (!params) return str;
  return Object.keys(params).reduce((s, key) => s.replace(`%${key}%`, params[key]), str);
};

// Minimal localStorage used by some utils (e.g. number formatting language).
const storage = new Map();
global.localStorage = {
  getItem: (k) => (storage.has(k) ? storage.get(k) : null),
  setItem: (k, v) => storage.set(k, String(v)),
  removeItem: (k) => storage.delete(k),
  clear: () => storage.clear(),
};
