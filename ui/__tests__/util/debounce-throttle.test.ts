import debounce from "../../util/debounce";
import throttle from "../../util/throttle";

beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  jest.useRealTimers();
});

describe("debounce", () => {
  it("fires once on the trailing edge after the wait", () => {
    const fn = jest.fn();
    const debounced = debounce(fn, 100);

    debounced("a");
    debounced("b");
    debounced("c");
    expect(fn).not.toHaveBeenCalled();

    jest.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenLastCalledWith("c");
  });

  it("resets the wait on each call", () => {
    const fn = jest.fn();
    const debounced = debounce(fn, 100);

    debounced();
    jest.advanceTimersByTime(60);
    debounced();
    jest.advanceTimersByTime(60);
    expect(fn).not.toHaveBeenCalled();
    jest.advanceTimersByTime(40);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("fires on the leading edge with immediate=true", () => {
    const fn = jest.fn();
    const debounced = debounce(fn, 100, true);

    debounced();
    expect(fn).toHaveBeenCalledTimes(1);
    debounced();
    expect(fn).toHaveBeenCalledTimes(1);
  });
});

describe("throttle", () => {
  it("fires immediately, then at most once per window", () => {
    const fn = jest.fn();
    const throttled = throttle(fn, 100);

    throttled();
    expect(fn).toHaveBeenCalledTimes(1);

    throttled();
    throttled();
    expect(fn).toHaveBeenCalledTimes(1);

    jest.advanceTimersByTime(100);
    // trailing call for the suppressed invocations
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it("cancel() suppresses the pending trailing call", () => {
    const fn = jest.fn();
    const throttled = throttle(fn, 100);

    throttled();
    throttled();
    throttled.cancel();
    jest.advanceTimersByTime(200);
    expect(fn).toHaveBeenCalledTimes(1);
  });
});
