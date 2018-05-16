import { clipboard, remote } from 'electron';
import isDev from 'electron-is-dev';

function textInputTemplate(target) {
  const somethingSelected = target.selectionStart < target.selectionEnd;
  const hasValue = target.value.length > 0;

  // Native Electron selectAll role does not work
  function selectAll() {
    target.selectionStart = 0;
    target.selectionEnd = target.value.length + 1;
  }

  const template = [
    { label: 'Cut', accelerator: 'CmdOrCtrl+X', role: 'cut', enabled: somethingSelected },
    { label: 'Copy', accelerator: 'CmdOrCtrl+C', role: 'copy', enabled: somethingSelected },
    {
      label: 'Paste',
      accelerator: 'CmdOrCtrl+V',
      role: 'paste',
      enabled: clipboard.readText().length > 0,
    },
    {
      label: 'Select All',
      accelerator: 'CmdOrCtrl+A',
      role: 'selectAll',
      enabled: hasValue,
      click: selectAll,
    },
  ];

  return template;
}

function getTemplate(target) {
  const { type } = target;
  if (target.matches('input') && (type === 'text' || type === 'number')) {
    return textInputTemplate(target);
  }
  return [];
}

export default event => {
  event.preventDefault();
  const { target } = event;
  const template = getTemplate(target);
  if (isDev) {
    const { screenX, screenY } = event;
    const separator = { type: 'separator' };
    const developmentTemplateAddition = [
      {
        label: 'Inspect element',
        accelerator: 'CmdOrCtrl+Shift+I',
        click: () => {
          remote.getCurrentWindow().inspectElement(screenX, screenY);
        },
      },
    ];
    if (template.length > 0) {
      template.push(separator);
    }
    template.push(...developmentTemplateAddition);
  }
  remote.Menu.buildFromTemplate(template).popup();
};
