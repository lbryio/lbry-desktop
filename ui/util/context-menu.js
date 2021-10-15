import { clipboard, remote, shell } from 'electron';
import { convertToShareLink } from 'util/lbryURI';
const isDev = process.env.NODE_ENV !== 'production';

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
  const isInput = event.target.matches('input') && (type === 'text' || type === 'number');
  const isTextField = canEdit || isInput || event.target.matches('textarea');
  const isSomethingSelected = selection.length > 0 || window.getSelection().toString().length > 0;

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
  remote.Menu.buildFromTemplate(templates).popup({});
}

// This function is used for the markdown description on the publish page
export function openEditorMenu(codeMirror, event) {
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

// This function is used for the CodeViewer component
export function openSnippetMenu(codeMirror, event) {
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
      // Enabled if there is text to select
      enabled: value.length > 0,
    },
  ];
  openContextMenu(event, templates, false, selection);
}

export function openClaimPreviewMenu(claim, event) {
  // @if TARGET='app'
  let templates = [];

  if (claim) {
    const shareLink = convertToShareLink(claim.canonical_url || claim.permanent_url);
    const claimId = claim.claim_id;

    templates.push({
      label: 'Copy link',
      click: () => {
        clipboard.writeText(shareLink);
      },
    });

    templates.push({ type: 'separator' });

    templates.push({
      label: 'Report content',
      click: () => {
        shell.openExternal(`https://lbry.com/dmca/${claimId}`);
      },
    });
  }

  injectDevelopmentTemplate(event, templates);

  if (templates.length !== 0) {
    remote.Menu.buildFromTemplate(templates).popup({});
  }
  // @endif
}

// Block context menu
export function stopContextMenu(event) {
  if (navigator.userAgent.toLowerCase().indexOf(' electron/') > -1) {
    event.preventDefault();
    event.stopPropagation();
  }
}
