//@ts-nocheck
export function isEmpty(object: unknown) {
  return object in [null, undefined] || (object.constructor === Object && Object.entries(object).length === 0);
}
