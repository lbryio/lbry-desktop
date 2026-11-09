//@ts-nocheck
import * as DAEMON_SETTINGS from 'constants/daemon_settings';
import isEqual from 'util/deep-equal';

export function stringifyServerParam(configList: unknown) {
  return configList.reduce<Array<any>>((acc, cur) => {
    acc.push(`${cur[0]}:${cur[1]}`);
    return acc;
  }, []);
}

export const getSubsetFromKeysArray = (obj: unknown, keys: unknown) =>
  Object.keys(obj)
    .filter((i) => keys.includes(i))
    .reduce<Record<string, any>>((acc, key) => {
      acc[key] = obj[key];
      return acc;
    }, {});

export const shouldSetSetting = (key: unknown, val: unknown, current: unknown) => {
  switch (key) {
    case DAEMON_SETTINGS.LBRYUM_SERVERS:
      return val !== null && Array.isArray(val) && val.length && !isEqual(val, current);
    default:
      return !isEqual(val, current);
  }
};
