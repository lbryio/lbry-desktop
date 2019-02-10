import { ipcRenderer } from 'electron';

const Native = {};

Native.getAppVersionInfo = () =>
  new Promise(resolve => {
    ipcRenderer.once('version-info-received', (event, versionInfo) => {
      resolve(versionInfo);
    });
    ipcRenderer.send('version-info-requested');
  });

export default Native;
