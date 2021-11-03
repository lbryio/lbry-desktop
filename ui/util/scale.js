// @flow

export function scaleToDevicePixelRatio(value: number) {
  const devicePixelRatio = window.devicePixelRatio || 1.0;
  return devicePixelRatio < 1.0 ? Math.ceil(value / devicePixelRatio) : Math.ceil(value * devicePixelRatio);
}
