//@ts-nocheck
import {app, Menu, Tray} from 'electron';
import path from 'path';
import showWindow from './showWindow';

let tray;

export default window: unknown => {
  let iconPath;

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

  const restoreFromTray = () => showWindow(window);

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
