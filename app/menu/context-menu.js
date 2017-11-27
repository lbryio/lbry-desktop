const {Menu} = require('electron');
const electron = require('electron');
const app = electron.app;

const contextMenuTemplate = [
  {
    role: 'cut',
  },
  {
    role: 'copy',
  },
  {
    role: 'paste',
  },
];

module.exports = {
  showContextMenu(win, posX, posY, showDevItems) {
    let template = contextMenuTemplate.slice();
    if (showDevItems) {
      template.push({
        type: 'separator',
      });
      template.push(
        {
          label: 'Inspect Element',
          click() {
            win.inspectElement(posX, posY);
          }
        }
      );
    }

    Menu.buildFromTemplate(template).popup(win);
  },
};
