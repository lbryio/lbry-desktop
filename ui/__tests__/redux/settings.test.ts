/**
 * @jest-environment jsdom
 */
// The automatic dark-mode check runs every 5 minutes. When day/night hasn't
// changed it must return the same state, because any new settings object makes
// every connected component recompute (#486).
import * as ACTIONS from "constants/action_types";

// default-languages pulls in the webpack-only "homepages" alias.
jest.mock("util/default-languages", () => ({ getDefaultLanguage: () => "en" }));

// The reducer reads the loaded UI languages at import time.
(window as any).i18n_messages = {};
const reducer = require("redux/reducers/settings").default;

const initial = () => reducer(undefined, { type: "@@INIT" });
// Default dark-mode window is 21:00 to 8:00; tests run in UTC (jest.config.js).
const at = (hhmm: string) => jest.setSystemTime(new Date(`2026-11-12T${hhmm}:00Z`));

describe("UPDATE_IS_NIGHT", () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  it("returns the same state during the day when it was already day", () => {
    at("13:00");
    const state = { ...initial(), isNight: false };
    expect(reducer(state, { type: ACTIONS.UPDATE_IS_NIGHT })).toBe(state);
  });

  it("returns the same state at night when it was already night", () => {
    at("23:30");
    const state = { ...initial(), isNight: true };
    expect(reducer(state, { type: ACTIONS.UPDATE_IS_NIGHT })).toBe(state);
  });

  it("switches to night after the start time", () => {
    at("21:05");
    const state = { ...initial(), isNight: false };
    const next = reducer(state, { type: ACTIONS.UPDATE_IS_NIGHT });
    expect(next).not.toBe(state);
    expect(next.isNight).toBe(true);
    expect(next.clientSettings).toBe(state.clientSettings);
  });

  it("switches back to day after the end time", () => {
    at("08:05");
    const state = { ...initial(), isNight: true };
    expect(reducer(state, { type: ACTIONS.UPDATE_IS_NIGHT }).isNight).toBe(false);
  });
});
