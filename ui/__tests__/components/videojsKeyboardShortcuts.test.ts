/**
 * @jest-environment jsdom
 */
// Player keyboard shortcuts (#483): a key the player acts on must not also do
// its browser default (scroll the page, press a focused button), and a key it
// leaves alone must keep its default.
jest.mock("component/viewers/videoViewer/internal/overlays", () => ({
  showVolumeverlay: jest.fn(),
  showSeekedOverlay: jest.fn(),
  showPlaybackRateOverlay: jest.fn(),
}));

import VideoJsKeyboardShortcuts from "component/viewers/videoViewer/internal/videojs-keyboard-shortcuts";

let video: HTMLVideoElement;
let player: any;
let playerEl: HTMLElement;
let onKeyDown: (e: KeyboardEvent) => void;

beforeEach(() => {
  document.body.innerHTML = `
    <button id="outside-button">Follow</button>
    <a id="outside-link" href="#x">A link</a>
    <input id="search" />
    <div class="video-js-parent">
      <div class="video-js" tabindex="-1"><video></video><button id="vjs-button">Play</button></div>
    </div>`;
  video = document.querySelector("video")!;
  playerEl = document.querySelector(".video-js")!;
  let paused = false;
  Object.defineProperty(video, "paused", { get: () => paused });
  Object.defineProperty(video, "duration", { value: 600 });
  video.play = jest.fn(() => {
    paused = false;
    return Promise.resolve();
  });
  video.pause = jest.fn(() => {
    paused = true;
  });
  video.currentTime = 100;

  let volume = 0.5;
  player = {
    volume: jest.fn((v?: number) => (v === undefined ? volume : (volume = v))),
    userActive: jest.fn(),
    isFullscreen: () => false,
    requestFullscreen: jest.fn(),
    exitFullscreen: jest.fn(),
    playbackRate: jest.fn(() => 1),
  };

  const { curried_function } = VideoJsKeyboardShortcuts({
    playNext: jest.fn(),
    playPrevious: jest.fn(),
    toggleVideoTheaterMode: jest.fn(),
  });
  onKeyDown = curried_function({ current: player }, { current: document.querySelector(".video-js-parent") });
  window.addEventListener("keydown", onKeyDown);
});

afterEach(() => window.removeEventListener("keydown", onKeyDown));

// Dispatch from the focused element, like a real key press, and report
// whether the browser default (scroll, button press) would still happen.
function press(key: string, keyCode: number, focus?: HTMLElement | null, init: KeyboardEventInit = {}) {
  if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
  if (focus) focus.focus();
  const target = (document.activeElement as HTMLElement) || document.body;
  const event = new KeyboardEvent("keydown", { key, keyCode, bubbles: true, cancelable: true, ...init } as any);
  target.dispatchEvent(event);
  return { defaultPrevented: event.defaultPrevented };
}

const SPACE: [string, number] = [" ", 32];
const UP: [string, number] = ["ArrowUp", 38];
const DOWN: [string, number] = ["ArrowDown", 40];
const LEFT: [string, number] = ["ArrowLeft", 37];
const RIGHT: [string, number] = ["ArrowRight", 39];

describe("Space", () => {
  it("pauses without scrolling when focus is on the page", () => {
    const r = press(...SPACE);
    expect(video.pause).toHaveBeenCalledTimes(1);
    expect(r.defaultPrevented).toBe(true);
  });

  it("pauses without scrolling when focus is in the player", () => {
    const r = press(...SPACE, playerEl);
    expect(video.pause).toHaveBeenCalledTimes(1);
    expect(r.defaultPrevented).toBe(true);
  });

  it("presses a focused button outside the player instead of pausing", () => {
    const r = press(...SPACE, document.getElementById("outside-button"));
    expect(video.pause).not.toHaveBeenCalled();
    expect(r.defaultPrevented).toBe(false);
  });

  it("is left alone while typing", () => {
    const r = press(...SPACE, document.getElementById("search"));
    expect(video.pause).not.toHaveBeenCalled();
    expect(r.defaultPrevented).toBe(false);
  });
});

describe("Up/Down", () => {
  it("scroll the page and leave the volume when focus is on the page", () => {
    expect(press(...DOWN).defaultPrevented).toBe(false);
    expect(press(...UP).defaultPrevented).toBe(false);
    expect(player.volume()).toBe(0.5);
  });

  it("change the volume without scrolling when focus is in the player", () => {
    expect(press(...DOWN, playerEl).defaultPrevented).toBe(true);
    expect(player.volume()).toBeCloseTo(0.45);
    expect(press(...UP, playerEl).defaultPrevented).toBe(true);
    expect(player.volume()).toBeCloseTo(0.5);
  });
});

describe("Left/Right", () => {
  it("seek 5 s without scrolling when focus is on the page", () => {
    expect(press(...RIGHT).defaultPrevented).toBe(true);
    expect(video.currentTime).toBe(105);
    expect(press(...LEFT).defaultPrevented).toBe(true);
    expect(video.currentTime).toBe(100);
  });

  it("are left to a focused control outside the player", () => {
    const r = press(...RIGHT, document.getElementById("outside-link"));
    expect(video.currentTime).toBe(100);
    expect(r.defaultPrevented).toBe(false);
  });
});

describe("other shortcuts", () => {
  it("k pauses and m mutes, even with a button focused", () => {
    press("k", 75, document.getElementById("outside-button"));
    expect(video.pause).toHaveBeenCalledTimes(1);
    press("m", 77, document.getElementById("outside-button"));
    expect(video.muted).toBe(true);
  });

  it("ignore keys with Ctrl/Alt/Meta held (e.g. Ctrl+F stays find)", () => {
    const r = press("f", 70, null, { ctrlKey: true });
    expect(player.requestFullscreen).not.toHaveBeenCalled();
    expect(r.defaultPrevented).toBe(false);
    expect(press(...SPACE, null, { altKey: true }).defaultPrevented).toBe(false);
    expect(video.pause).not.toHaveBeenCalled();
  });
});
