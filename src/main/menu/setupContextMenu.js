// @flow
import { Menu, BrowserWindow } from 'electron';
import isDev from 'electron-is-dev';

export default (rendererWindow: BrowserWindow) => {
  rendererWindow.webContents.on('context-menu', (e, params) => {
    const { x, y } = params;

    const template = [{ role: 'cut' }, { role: 'copy' }, { role: 'paste' }];

    const developmentTemplateAddition = [
      { type: 'separator' },
      {
        label: 'Inspect element',
        click: () => {
          rendererWindow.inspectElement(x, y);
        },
      },
    ];

    if (isDev) {
      template.push(...developmentTemplateAddition);
    }

    Menu.buildFromTemplate(template).popup();
  });
};
