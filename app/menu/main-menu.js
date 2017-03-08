const {Menu} = require('electron');
const electron = require('electron');
const app = electron.app;

const template = [
  {
    label: 'Edit',
    submenu: [
      {
        role: 'undo'
      },
      {
        role: 'redo'
      },
      {
        type: 'separator'
      },
      {
        role: 'cut'
      },
      {
        role: 'copy'
      },
      {
        role: 'paste'
      },
      {
        role: 'delete'
      },
      {
        role: 'selectall'
      }
    ]
  },
  {
    label: 'Help',
    submenu: [
      {
        label: 'FAQ',
        click () { require('electron').shell.openExternal('https://lbry.io/faq') }
      }
    ]
  }
];

module.exports = {
  showNormalMenubar: () => {
    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
  },
  showDeveloperMenubar: () => {
    const devTemplate = template.slice();
    devTemplate.push({
      label: 'Developer',
      submenu: [
        {
          label: 'Reload',
          accelerator: 'CmdOrCtrl+R',
          click (item, focusedWindow) {
            if (focusedWindow) focusedWindow.reload()
          }
        },
        {
          label: 'Toggle Developer Tools',
          accelerator: process.platform === 'darwin' ? 'Alt+Command+I' : 'Ctrl+Shift+I',
          click (item, focusedWindow) {
            if (focusedWindow) focusedWindow.webContents.toggleDevTools()
          }
        },
      ]
    });

    const menu = Menu.buildFromTemplate(devTemplate);
    Menu.setApplicationMenu(menu);
  }
};
