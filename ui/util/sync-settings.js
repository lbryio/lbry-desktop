import * as DAEMON_SETTINGS from 'constants/daemon_settings';
import isEqual from 'util/deep-equal';

export function stringifyServerParam(configList) {
  return configList.reduce((acc, cur) => {
    acc.push(`${cur[0]}:${cur[1]}`);
    return acc;
  }, []);
}

export const getSubsetFromKeysArray = (obj, keys) =>
  Object.keys(obj)
    .filter((i) => keys.includes(i))
    .reduce((acc, key) => {
      acc[key] = obj[key];
      return acc;
    }, {});

export const shouldSetSetting = (key, val, current) => {
  switch (key) {
    case DAEMON_SETTINGS.LBRYUM_SERVERS:
      return val !== null && Array.isArray(val) && val.length && !isEqual(val, current);
    default:
      return !isEqual(val, current);
  }
};
