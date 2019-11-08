// @flow
import { ipcRenderer } from 'electron';

export const checkUpgradeDisabled = () => {
  return new Promise<*>(resolve => {
    // @if TARGET='app'
    ipcRenderer.once('get-updates-disabled-response', (event, disabled) => {
      resolve(disabled);
    });
    ipcRenderer.send('get-updates-disabled');
    // @endif
  });
};
