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

export function openContextMenu(event, templates = []) {
  const isSomethingSelected = window.getSelection().toString().length > 0;
  const { type } = event.target;
  const isInput = event.target.matches('input') && (type === 'text' || type === 'number');
  const { value } = event.target;

  templates.push({
    label: 'Copy',
    accelerator: 'CmdOrCtrl+C',
    role: 'copy',
    enabled: isSomethingSelected,
  });

  // If context menu is opened on Input and there is text on the input and something is selected.
  const { selectionStart, selectionEnd } = event.target;
  if (!!value && isInput && selectionStart !== selectionEnd) {
    templates.push({ label: 'Cut', accelerator: 'CmdOrCtrl+X', role: 'cut' });
  }

  // If context menu is opened on Input and text is present on clipboard
  if (clipboard.readText().length > 0 && isInput) {
    templates.push({
      label: 'Paste',
      accelerator: 'CmdOrCtrl+V',
      role: 'paste',
    });
  }

  // If context menu is opened on Input
  if (isInput && value) {
    templates.push({
      label: 'Select All',
      accelerator: 'CmdOrCtrl+A',
      role: 'selectall',
    });
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
