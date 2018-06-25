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

export function openContextMenu(event, templates = [], canEdit = false, selection = '') {
  const { type, value } = event.target;
  const isSomethingSelected = selection.length > 0 || window.getSelection().toString().length > 0;
  const isInput = event.target.matches('input') && (type === 'text' || type === 'number');
  const isTextField = canEdit || isInput || event.target.matches('textarea');

  templates.push({
    label: 'Copy',
    accelerator: 'CmdOrCtrl+C',
    role: 'copy',
    enabled: isSomethingSelected,
  });

  // If context menu is opened on Input and there is text on the input and something is selected.
  const { selectionStart, selectionEnd } = event.target;
  if (!!value && isTextField && selectionStart !== selectionEnd) {
    templates.push({ label: 'Cut', accelerator: 'CmdOrCtrl+X', role: 'cut' });
  }

  // If context menu is opened on Input and text is present on clipboard
  if (clipboard.readText().length > 0 && isTextField) {
    templates.push({
      label: 'Paste',
      accelerator: 'CmdOrCtrl+V',
      role: 'paste',
    });
  }

  // If context menu is opened on Input
  if (isTextField && value) {
    templates.push({
      label: 'Select All',
      accelerator: 'CmdOrCtrl+A',
      role: 'selectall',
    });
  }

  injectDevelopmentTemplate(event, templates);
  remote.Menu.buildFromTemplate(templates).popup();
}

export function openEditorMenu(event, codeMirror) {
  const value = codeMirror.doc.getValue();
  const selection = codeMirror.doc.getSelection();
  const templates = [
    {
      label: 'Select All',
      accelerator: 'CmdOrCtrl+A',
      role: 'selectall',
      click: () => {
        codeMirror.execCommand('selectAll');
      },
      enabled: value.length > 0,
    },
    {
      label: 'Cut',
      accelerator: 'CmdOrCtrl+X',
      role: 'cut',
      enabled: selection.length > 0,
    },
  ];
  openContextMenu(event, templates, true, selection);
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
  openContextMenu(event, templates);
}
