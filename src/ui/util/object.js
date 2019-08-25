export function isEmpty(object) {
  return object in [null, undefined] || (object.constructor === Object && Object.entries(object).length === 0);
}
