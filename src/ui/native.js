const Native = {};

// @if TARGET='app'
import { ipcRenderer } from 'electron';

Native.getAppVersionInfo = () =>
  new Promise(resolve => {
    // @if TARGET='app'
    ipcRenderer.once('version-info-received', (event, versionInfo) => {
      resolve(versionInfo);
    });
    ipcRenderer.send('version-info-requested');
    // @endif
  });
// @endif

// @if TARGET='app'
Native.imagePath = file => `${staticResourcesPath}/img/${file}`;
// @endif
// @if TARGET='web'
Native.imagePath = file => `staticResourcesPath/img/${file}`;
// @endif

export default Native;
