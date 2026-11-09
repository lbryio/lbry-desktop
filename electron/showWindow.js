// Bringing the app window back from the taskbar or tray in the state the user left it in.
//
// On Windows, isMaximized() is false while a maximized window is minimized, and show() then brings
// it back unmaximized. So whether the window is maximized is tracked from its own events instead.
const maximized = new WeakMap();

// Call before anything can maximize the window (e.g. electron-window-state's manage()).
export function trackMaximized(window) {
  maximized.set(window, window.isMaximized());
  window.on('maximize', () => maximized.set(window, true));
  window.on('unmaximize', () => maximized.set(window, false));
}

export default function showWindow(window) {
  if (window.isMinimized()) {
    // Back to the state it had before it was minimized, maximized included.
    window.restore();
  }
  if (maximized.get(window) && !window.isMaximized()) {
    window.maximize();
  }
  window.show();
  window.focus();
}
