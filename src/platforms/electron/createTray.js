import { app, Menu, Tray } from 'electron';
import path from 'path';

let tray;

export default window => {
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

  tray.on('double-click', () => {
    window.show();
  });

  tray.setToolTip('LBRY App');

  const template = [
    {
      label: `Open ${app.getName()}`,
      click: () => {
        window.show();
      },
    },
    { role: 'quit' },
  ];
  const contextMenu = Menu.buildFromTemplate(template);
  tray.setContextMenu(contextMenu);

  return tray;
};
