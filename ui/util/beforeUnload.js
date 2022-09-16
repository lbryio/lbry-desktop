window.beforeUnloadMap = window.beforeUnloadMap || {};

export const Unload = {
  register: (cb) => {
    window.addEventListener('unload', cb);
  },

  unregister: (cb) => {
    window.removeEventListener('unload', cb);
  },
};

export const BeforeUnload = {
  register: (cb, msg) => {
    window.addEventListener('beforeunload', cb);
    window.beforeUnloadMap[cb] = { cb, msg };
  },

  unregister: (cb) => {
    window.removeEventListener('beforeunload', cb);
    delete window.beforeUnloadMap[cb];
  },
};
