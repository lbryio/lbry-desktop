/**
 * @jest-environment jsdom
 */
// Regression tests for #671: the VideoJs component must build one player per
// source and keep it across ordinary re-renders.
import * as React from "react";
import { act, render } from "@testing-library/react";

// A fake video.js: records each player it creates. The ready callback is never
// called, so the real plugins and event wiring stay out of the way.
jest.mock("video.js", () => {
  const players: any[] = [];
  const videojs: any = jest.fn((el: HTMLElement, options: any) => {
    let disposed = false;
    const player = {
      el,
      options,
      on: jest.fn(),
      isDisposed: () => disposed,
      dispose: jest.fn(() => {
        disposed = true;
      }),
    };
    players.push(player);
    return player;
  });
  videojs.players = players;
  videojs.browser = { IS_ANY_SAFARI: false };
  videojs.getPlugins = () => ({});
  videojs.registerPlugin = jest.fn();
  return { __esModule: true, default: videojs };
});

jest.mock("videojs-event-tracking", () => ({}));
jest.mock("videojs-contrib-quality-levels", () => ({}));
jest.mock("component/viewers/videoViewer/internal/plugins/videojs-mobile-ui/plugin", () => ({}));
jest.mock("component/viewers/videoViewer/internal/plugins/videojs-hls-quality-selector/plugin", () => ({}));
jest.mock("component/viewers/videoViewer/internal/plugins/videojs-recsys/plugin", () => ({}));
jest.mock("component/viewers/videoViewer/internal/overlays", () => ({ OVERLAY_DATA: [] }));
jest.mock("component/viewers/videoViewer/internal/lbry-volume-bar", () => ({
  __esModule: true,
  default: { replaceExisting: jest.fn() },
}));
jest.mock("component/viewers/videoViewer/internal/videojs-events", () => ({
  __esModule: true,
  default: () => ({ unmuteAndHideHint: jest.fn(), retryVideoAfterFailure: jest.fn(), initializeEvents: jest.fn() }),
}));
jest.mock("component/viewers/videoViewer/internal/videojs-keyboard-shortcuts", () => ({
  __esModule: true,
  default: () => ({ curried_function: () => () => {} }),
}));
jest.mock("component/button", () => {
  const MockReact = require("react");
  return { __esModule: true, default: MockReact.forwardRef(() => null) };
});

import VideoJs from "component/viewers/videoViewer/internal/videojs";

const videojs: any = require("video.js").default;

const SOURCE = "http://localhost:5280/stream/aaa";

// New function identities on every call, like the real parent passes, so
// React.memo doesn't skip the re-render.
function props(overrides: Record<string, any> = {}): any {
  return {
    source: SOURCE,
    sourceType: "video/mp4",
    poster: null,
    onPlayerReady: () => {},
    isAudio: false,
    autoplay: true,
    autoplaySetting: true,
    toggleVideoTheaterMode: () => {},
    claimId: "abc",
    userId: 1,
    shareTelemetry: false,
    replay: false,
    videoTheaterMode: false,
    playNext: () => {},
    playPrevious: () => {},
    ...overrides,
  };
}

const flush = () =>
  act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 0));
  });

beforeEach(() => {
  videojs.mockClear();
  videojs.players.length = 0;
  (global as any).fetch = jest.fn(() => Promise.resolve({ redirected: false, url: SOURCE }));
});

it("keeps a single player across re-renders", async () => {
  const { rerender, container } = render(<VideoJs {...props()} />);
  await flush();
  expect(videojs).toHaveBeenCalledTimes(1);

  for (let i = 0; i < 5; i++) rerender(<VideoJs {...props()} />);
  await flush();

  expect(videojs).toHaveBeenCalledTimes(1);
  expect(videojs.players[0].dispose).not.toHaveBeenCalled();
  expect(container.querySelectorAll("[data-vjs-player]")).toHaveLength(1);
});

it("doesn't re-send the HEAD pre-fetch on re-renders", async () => {
  const { rerender } = render(<VideoJs {...props()} />);
  await flush();
  const afterMount = (global as any).fetch.mock.calls.length;

  for (let i = 0; i < 5; i++) rerender(<VideoJs {...props()} />);
  await flush();

  expect((global as any).fetch.mock.calls.length).toBe(afterMount);
});

it("rebuilds the player when the source changes", async () => {
  const { rerender } = render(<VideoJs {...props()} />);
  await flush();

  rerender(<VideoJs {...props({ source: "http://localhost:5280/stream/bbb" })} />);
  await flush();

  expect(videojs).toHaveBeenCalledTimes(2);
  expect(videojs.players[0].dispose).toHaveBeenCalledTimes(1);
  expect(videojs.players[1].options.sources[0].src).toBe("http://localhost:5280/stream/bbb");
});

it("doesn't build a player if it's unmounted before the pre-fetch finishes", async () => {
  // The component sends two HEAD requests on mount; hold them all.
  const pending: Array<(value: any) => void> = [];
  (global as any).fetch = jest.fn(() => new Promise((resolve) => pending.push(resolve)));

  const { unmount } = render(<VideoJs {...props()} />);
  unmount();
  pending.forEach((resolve) => resolve({ redirected: false, url: SOURCE }));
  await flush();

  expect(videojs).not.toHaveBeenCalled();
});

it("still starts the player when the pre-fetch fails", async () => {
  (global as any).fetch = jest.fn(() => Promise.reject(new TypeError("Failed to fetch")));
  const warn = jest.spyOn(console, "warn").mockImplementation(() => {});

  render(<VideoJs {...props()} />);
  await flush();

  expect(videojs).toHaveBeenCalledTimes(1);
  expect(videojs.players[0].options.sources[0].src).toBe(SOURCE);
  warn.mockRestore();
});

it("doesn't let a failing dispose escape the cleanup", async () => {
  const warn = jest.spyOn(console, "warn").mockImplementation(() => {});
  const { unmount } = render(<VideoJs {...props()} />);
  await flush();
  videojs.players[0].dispose.mockImplementation(() => {
    throw new Error("Invalid target for null#trigger");
  });

  expect(() => unmount()).not.toThrow();
  warn.mockRestore();
});
