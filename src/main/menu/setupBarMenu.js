import { app, Menu, shell } from 'electron';

export default () => {
  const template = [
    {
      label: 'File',
      submenu: [{ role: 'quit', accelerator: 'CmdOrCtrl+Q' }],
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
      ],
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        {
          label: 'Developer',
          submenu: [{ role: 'forcereload' }, { role: 'toggledevtools' }],
        },
        { type: 'separator' },
        { role: 'togglefullscreen' },
      ],
    },
    {
      role: 'window',
      submenu: [{ role: 'minimize' }, { role: 'close' }],
    },
    {
      role: 'help',
      submenu: [
        {
          label: 'Learn More',
          click: (menuItem, browserWindow) => {
            if (browserWindow) {
              browserWindow.webContents.send('open-menu', '/help');
            } else {
              shell.openExternal('https://lbry.io/faq');
            }
          },
        },
        {
          label: 'Frequently Asked Questions',
          click: () => {
            shell.openExternal('https://lbry.io/faq');
          },
        },
        { type: 'separator' },
        {
          label: 'Report Issue',
          click: () => {
            shell.openExternal('https://github.com/lbryio/lbry-desktop/issues/new');
          },
        },
        { type: 'separator' },
        {
          label: 'Developer API Guide',
          click: () => {
            shell.openExternal('https://lbry.io/quickstart');
          },
        },
      ],
    },
  ];

  const darwinTemplateAddition = {
    label: app.getName(),
    submenu: [
      { role: 'about' },
      { type: 'separator' },
      { role: 'services', submenu: [] },
      { type: 'separator' },
      { role: 'hide' },
      { role: 'hideothers' },
      { type: 'separator' },
      { role: 'quit' },
    ],
  };

  if (process.platform === 'darwin') {
    template.unshift(darwinTemplateAddition);
  }

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
};
