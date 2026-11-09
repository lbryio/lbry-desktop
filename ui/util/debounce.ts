//@ts-nocheck
// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
export default function debouce(func: unknown, waitInMs: unknown, immediate?: unknown) {
  let timeout;

  return function (...funcArgs: any[]) {
    const context = this;
    const args = funcArgs;
    const later = () => {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };

    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, waitInMs);
    if (callNow) func.apply(context, args);
  };
}
