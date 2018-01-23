import { app, Menu, Tray as ElectronTray } from 'electron';
import path from 'path';
import createWindow from './createWindow';

export default class Tray {
  window;
  updateAttachedWindow;
  tray;

  constructor(window, updateAttachedWindow) {
    this.window = window;
    this.updateAttachedWindow = updateAttachedWindow;
  }

  create() {
    let iconPath;
    switch (process.platform) {
      case 'darwin': {
        iconPath = path.join(__static, '/img/tray/mac/trayTemplate.png');
        break;
      }
      case 'win32': {
        iconPath = path.join(__static, '/img/tray/windows/tray.ico');
        break;
      }
      default: {
        iconPath = path.join(__static, '/img/tray/default/tray.png');
      }
    }

    this.tray = new ElectronTray(iconPath);

    this.tray.on('double-click', () => {
      if (!this.window || this.window.isDestroyed()) {
        this.window = createWindow();
        this.updateAttachedWindow(this.window);
      } else {
        this.window.show();
        this.window.focus();
      }
    });

    this.tray.setToolTip('LBRY App');

    const template = [
      {
        label: `Open ${app.getName()}`,
        click: () => {
          if (!this.window || this.window.isDestroyed()) {
            this.window = createWindow();
            this.updateAttachedWindow(this.window);
          } else {
            this.window.show();
            this.window.focus();
          }
        },
      },
      { role: 'quit' },
    ];
    const contextMenu = Menu.buildFromTemplate(template);
    this.tray.setContextMenu(contextMenu);
  }
}
