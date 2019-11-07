function logWarning(method) {
  if (NODE_ENV !== 'production') {
    console.error(`Called fs.${method} on lbry.tv. This should be removed.`);
  }
}

export default {
  readFileSync: () => {
    logWarning('readFileSync');
    return undefined;
  },
  accessFileSync: () => {
    logWarning('accessFileSync');
    return undefined;
  },
  constants: {},
};
