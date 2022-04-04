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

  let timeString = date.toISOString().slice(11, 19);
  if (timeString.startsWith('00:')) {
    timeString = timeString.slice(3);
  }

  return timeString;
}
