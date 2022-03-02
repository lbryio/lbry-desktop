// @flow
import { LOCALE_API } from 'config';

export async function fetchLocaleApi() {
  return fetch(LOCALE_API).then((res) => res.json());
}
