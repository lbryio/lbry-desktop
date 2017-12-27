import { app, Menu, shell } from 'electron';
import { safeQuit } from '../index';

const baseTemplate = [
  {
    label: 'File',
    submenu: [
      {
        label: 'Quit',
        accelerator: 'CommandOrControl+Q',
        click: () => safeQuit(),
      },
    ],
  },
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
    ],
  },
  {
    label: 'View',
    submenu: [
      {
        role: 'reload',
      },
      {
        label: 'Developer',
        submenu: [
          {
            role: 'forcereload',
          },
          {
            role: 'toggledevtools',
          },
        ],
      },
      {
        type: 'separator',
      },
      {
        role: 'togglefullscreen',
      },
    ],
  },
  {
    role: 'help',
    submenu: [
      {
        label: 'Learn More',
        click(item, focusedWindow) {
          if (focusedWindow) {
            focusedWindow.webContents.send('open-menu', '/help');
          }
        },
      },
      {
        label: 'Frequently Asked Questions',
        click() {
          shell.openExternal('https://lbry.io/faq');
        },
      },
      {
        type: 'separator',
      },
      {
        label: 'Report Issue',
        click() {
          shell.openExternal('https://lbry.io/faq/contributing#report-a-bug');
        },
      },
      {
        type: 'separator',
      },
      {
        label: 'Developer API Guide',
        click() {
          shell.openExternal('https://lbry.io/quickstart');
        },
      },
    ],
  },
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
  ],
};

export default () => {
  const template = baseTemplate.slice();
  if (process.platform === 'darwin') {
    template.unshift(macOSAppMenuTemplate);
  }
  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
};
