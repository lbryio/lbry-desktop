import { app, Menu, Tray } from 'electron';
import path from 'path';

let tray;

export default window => {
  let iconPath;

  /*
   * A maximized window can't be properly
   * restored when minimized to the taskbar
   * (it will be restored/showed as unmaximized).
   *
   * window.isMaximized() will also return
   * false when minimizing a maximized window.
   *
   * The safest way to keep track of the
   * maximized state using maximize and
   * unmaximize events.
   */
  let isWindowMaximized = false;
  window.on('maximize', () => {
    isWindowMaximized = true;
  });
  window.on('unmaximize', () => {
    isWindowMaximized = false;
  });

  switch (process.platform) {
    case 'darwin': {
      iconPath = 'static/img/tray/mac/trayTemplate.png';
      break;
    }
    case 'win32': {
      iconPath = 'static/img/tray/windows/tray.ico';
      break;
    }
    default: {
      iconPath = 'static/img/tray/default/tray.png';
    }
  }

  tray = new Tray(process.env.NODE_ENV === 'development' ? iconPath : path.join(process.resourcesPath, iconPath));

  const restoreFromTray = () => {
    if (isWindowMaximized) {
      window.maximize();
    }
    window.show();
  };

  tray.on('double-click', restoreFromTray);

  tray.setToolTip('LBRY App');

  const template = [
    {
      label: `Open ${app.name}`,
      click: restoreFromTray,
    },
    { role: 'quit' },
  ];
  const contextMenu = Menu.buildFromTemplate(template);
  tray.setContextMenu(contextMenu);

  return tray;
};
