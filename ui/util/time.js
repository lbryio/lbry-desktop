// @flow
import moment from 'moment';

export function secondsToHms(seconds: number) {
  seconds = Math.floor(seconds);
  var hours = Math.floor(seconds / 3600);
  var minutes = Math.floor(seconds / 60) % 60;
  var seconds = seconds % 60;

  return [hours, minutes, seconds]
    .map((v) => (v < 10 ? '0' + v : v))
    .filter((v, i) => v !== '00' || i > 0)
    .join(':');
}

export function hmsToSeconds(str: string) {
  let timeParts = str.split(':'),
    seconds = 0,
    multiplier = 1;

  if (timeParts.length > 0) {
    while (timeParts.length > 0) {
      let nextPart = parseInt(timeParts.pop(), 10);
      if (!Number.isInteger(nextPart)) {
        nextPart = 0;
      }
      seconds += multiplier * nextPart;
      multiplier *= 60;
    }
  } else {
    seconds = 0;
  }

  return seconds;
}

// Only intended use of future dates is for claims, in case of scheduled
// publishes or livestreams, used in util/formatAriaLabel
export function getTimeAgoStr(date: any, showFutureDate?: boolean) {
  const suffixList = ['years', 'months', 'days', 'hours', 'minutes', 'seconds'];
  let duration = 0;
  let suffix = '';

  suffixList.some((s) => {
    // moment() is very liberal with it's rounding.
    // Always round down dates for better youtube parity.
    duration = Math.floor(moment().diff(date, s));
    suffix = s;

    return duration > 0;
  });

  // negative duration === it's a future date from now
  if (duration < 0 && showFutureDate) return __(moment(date).from(moment()));

  // Strip off the ending 's' for the singular suffix
  if (duration === 1) suffix = suffix.replace(/s$/g, '');

  const str = duration <= 0 ? 'Just now' : '%duration% ' + suffix + ' ago';

  return __(str, { duration });
}
