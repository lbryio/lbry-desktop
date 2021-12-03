// @flow

export function serializeFileObj(file: File) {
  return `${file.name}#${file.type}#${file.size}`;
}
