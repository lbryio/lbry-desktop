const {Menu} = require('electron');
const electron = require('electron');
const app = electron.app;

const baseTemplate = [
  {
    label: 'Edit',
    submenu: [
      {
        role: 'undo',
      },
      {
        role: 'redo',
      },
      {
        type: 'separator',
      },
      {
        role: 'cut',
      },
      {
        role: 'copy',
      },
      {
        role: 'paste',
      },
      {
        role: 'selectall',
      },
    ]
  },
  {
    label: 'Help',
    submenu: [
      {
        label: 'Help',
        click(item, focusedWindow) {
          if (focusedWindow) {
            focusedWindow.loadURL(`file://${__dirname}/../dist/index.html?help`);
          }
        }
      }
    ]
  }
];

const macOSAppMenuTemplate = {
  label: app.getName(),
  submenu: [
    {
      role: 'about',
    },
    {
      type: 'separator',
    },
    {
      role: 'hide',
    },
    {
      role: 'hideothers',
    },
    {
      role: 'unhide',
    },
    {
      type: 'separator',
    },
    {
      role: 'quit',
    },
  ]
};

const developerMenuTemplate = {
  label: 'Developer',
  submenu: [
    {
      label: 'Reload',
      accelerator: 'CmdOrCtrl+R',
      click(item, focusedWindow) {
        if (focusedWindow) {
          focusedWindow.reload();
        }
      }
    },
    {
      label: 'Toggle Developer Tools',
      accelerator: process.platform == 'darwin' ? 'Alt+Command+I' : 'Ctrl+Shift+I',
      click(item, focusedWindow) {
        if (focusedWindow) {
          focusedWindow.webContents.toggleDevTools();
        }
      }
    },
  ]
};

module.exports = {
  showMenubar(showDeveloperMenu) {
    let template = baseTemplate.slice();
    if (process.platform === 'darwin') {
      template.unshift(macOSAppMenuTemplate);
    }
    if (showDeveloperMenu) {
      template.push(developerMenuTemplate);
    }

    Menu.setApplicationMenu(Menu.buildFromTemplate(template));
  },
};
