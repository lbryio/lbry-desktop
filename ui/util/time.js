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

export function secondsToDhms(seconds: number) {
  seconds = Number(seconds);
  const d = Math.floor(seconds / (3600 * 24));
  const h = Math.floor((seconds % (3600 * 24)) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);

  const dDisplay = d > 0 ? d + (d === 1 ? ' day' : ' days') : '';
  const hDisplay = h > 0 ? h + (h === 1 ? ' hour' : ' hours') : '';
  const mDisplay = m > 0 ? m + (m === 1 ? ' minute' : ' minutes') : '';
  const sDisplay = s > 0 ? s + (s === 1 ? ' second' : ' seconds') : '';

  // build the return string
  let returnText = '';
  if (dDisplay) returnText = dDisplay;
  if (hDisplay) {
    if (dDisplay) {
      returnText = returnText + ', ' + hDisplay;
    } else {
      returnText = hDisplay;
    }
  }
  if (mDisplay) {
    if (hDisplay || dDisplay) {
      returnText = returnText + ', ' + mDisplay;
    } else if (sDisplay) {
      returnText = mDisplay + ', ' + sDisplay;
    } else {
      returnText = mDisplay;
    }
  }
  if (sDisplay) {
    if (!dDisplay && !dDisplay && !mDisplay) {
      returnText = sDisplay;
    }
  }

  return returnText;
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
export function getTimeAgoStr(
  date: any,
  showFutureDate?: boolean,
  genericSecondsString?: boolean,
  zeroDurationStr: string = 'Just now'
) {
  const suffixList = ['years', 'months', 'days', 'hours', 'minutes', 'seconds'];
  let duration = 0;
  let suffix = '';
  let str = '';

  suffixList.some((s) => {
    // moment() is very liberal with it's rounding.
    // Always round down dates for better youtube parity.
    duration = Math.floor(moment().diff(date, s));
    suffix = s;

    return duration > 0 || (showFutureDate && duration * -1 > 0);
  });

  // Strip off the ending 's' for the singular suffix
  if (duration === 1 || (duration === -1 && showFutureDate)) suffix = suffix.replace(/s$/g, '');

  // negative duration === it's a future date from now
  if (duration < 0 && showFutureDate) {
    str = suffix === 'seconds' ? 'in a few seconds' : 'in %duration% ' + suffix;
    duration = duration * -1;
  } else if (duration <= 0) {
    str = zeroDurationStr;
  } else {
    str = suffix === 'seconds' && genericSecondsString ? 'A few seconds ago' : '%duration% ' + suffix + ' ago';
  }

  return __(str, { duration });
}

export const getCurrentTimeInSec = () => Math.floor(Date.now() / 1000);

export const formatDateToMonthAndDay = (date: any) => moment(new Date(date)).format('MMMM DD');
export const formatDateToMonthDayAndYear = (date: any) => moment(new Date(date)).format('MMMM DD YYYY');
