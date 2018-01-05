import { Menu } from 'electron';

const contextMenuTemplate = [{ role: 'cut' }, { role: 'copy' }, { role: 'paste' }];

export default (win, posX, posY, showDevItems) => {
  const template = contextMenuTemplate.slice();
  if (showDevItems) {
    template.push({
      type: 'separator',
    });
    template.push({
      label: 'Inspect Element',
      click() {
        win.inspectElement(posX, posY);
      },
    });
  }

  Menu.buildFromTemplate(template).popup(win);
};
