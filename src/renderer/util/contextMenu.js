import { clipboard, remote } from 'electron';
import isDev from 'electron-is-dev';

function injectDevelopmentTemplate(event, templates) {
  if (!isDev) return templates;
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
  if (templates.length > 0) {
    templates.push(separator);
  }
  templates.push(...developmentTemplateAddition);
  return templates;
}

export function openContextMenu(event, templates = [], addDefaultTemplates = true) {
  if (addDefaultTemplates) {
    const { value } = event.target;
    const inputTemplates = [
      { label: 'Cut', accelerator: 'CmdOrCtrl+X', role: 'cut' },
      { label: 'Copy', accelerator: 'CmdOrCtrl+C', role: 'copy' },
      {
        label: 'Paste',
        accelerator: 'CmdOrCtrl+V',
        role: 'paste',
        enabled: clipboard.readText().length > 0,
      },
      {
        label: 'Select All',
        accelerator: 'CmdOrCtrl+A',
        role: 'selectall',
        enabled: !!value,
      },
    ];
    templates.push(...inputTemplates);
  }

  injectDevelopmentTemplate(event, templates);
  remote.Menu.buildFromTemplate(templates).popup();
}
export function openCopyLinkMenu(text, event) {
  const templates = [
    {
      label: 'Copy link',
      click: () => {
        clipboard.writeText(text);
      },
    },
  ];
  openContextMenu(event, templates, false);
}

export function initContextMenu(event) {
  const { type } = event.target;
  if (event.target.matches('input') && (type === 'text' || type === 'number')) {
    openContextMenu(event);
  } else {
    event.preventDefault();
  }
}
