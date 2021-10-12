// @flow

export function serializeFileObj(file: File) {
  // $FlowFixMe - these are non standard, but try to include anyway.
  const aux = `${String(file.lastModifiedDate)}#${String(file.webkitRelativePath)}`;

  return `${file.name}#${file.type}#${file.size}#${file.lastModified}#${aux}`;
}
