// Electron APIs aren't available under Jest; tests mock what they use.
module.exports = {
  ipcRenderer: { on: () => {}, send: () => {}, invoke: () => Promise.resolve({}), removeListener: () => {} },
  clipboard: { writeText: () => {} },
  shell: { openExternal: () => {}, openPath: () => {}, showItemInFolder: () => {} },
};
