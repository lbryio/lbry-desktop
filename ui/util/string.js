// @flow

export function toCapitalCase(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function getHoursStr(hours: number) {
  return hours <= 0 ? '---' : hours === 1 ? __('1 hour') : __('%value% hours', { value: hours });
}

export function getYesNoStr(state: boolean) {
  return state ? __('Yes') : __('No');
}
