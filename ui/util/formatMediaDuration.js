import moment from 'moment';

export default function formatMediaDuration(duration = 0, config) {
  const options = {
    screenReader: false,
    ...config,
  };

  // Optimize for screen readers
  if (options.screenReader) {
    return moment.utc(moment.duration(duration, 'seconds').asMilliseconds()).format('HH:mm:ss');
  }

  // Normal format
  let date = new Date(null);
  date.setSeconds(duration);

  let timeString = date.toISOString().substr(11, 8);
  if (timeString.startsWith('00:')) {
    timeString = timeString.substr(3);
  }

  return timeString;
}

// TODO: need a better file location:

// @flow
export function getChannelSubCountStr(count: ?number, formattedCount?: ?string) {
  if (count === null || count === undefined) {
    return null;
  } else {
    return count === 1 ? __('1 follower') : __('%count% followers', { count: formattedCount || count });
  }
}

// @flow
export function getChannelViewCountStr(count: number) {
  return count === 1 ? __('1 upload') : __('%count% uploads', { count });
}
