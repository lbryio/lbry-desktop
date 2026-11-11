//@ts-nocheck
import { clipboard, ipcRenderer, shell } from "electron";
import { convertToShareLink } from "util/lbryURI";
const isDev = process.env.NODE_ENV !== "production";

let contextMenuId = 0;
const contextMenuCallbacks = {};

ipcRenderer.on("context-menu-clicked", (event, id) => {
  const callback = contextMenuCallbacks[id];
  if (callback) {
    delete contextMenuCallbacks[id];
    callback();
  }
});

function serializeTemplate(templates) {
  return templates.map((template) => {
    const item = Object.assign({}, template);

    if (item.submenu) {
      item.submenu = serializeTemplate(item.submenu);
    }

    if (typeof item.click === "function") {
      const id = `context-menu-${contextMenuId++}`;
      contextMenuCallbacks[id] = item.click;
      item.id = id;
      delete item.click;
      // A role would take precedence over the click handler in the main process.
      delete item.role;
    }

    return item;
  });
}

function popupContextMenu(templates) {
  Object.keys(contextMenuCallbacks).forEach((id) => delete contextMenuCallbacks[id]);
  ipcRenderer.send("show-context-menu", serializeTemplate(templates));
}

function injectDevelopmentTemplate(event: unknown, templates: unknown) {
  if (!isDev) return templates;
  const { screenX, screenY } = event;
  const separator = { type: "separator" } as const;
  const developmentTemplateAddition = [
    {
      label: "Inspect element",
      accelerator: "CmdOrCtrl+Shift+I",
      click: () => {
        ipcRenderer.send("inspect-element", screenX, screenY);
      },
    },
  ];
  if (templates.length > 0) {
    templates.push(separator);
  }
  templates.push(...developmentTemplateAddition);
  return templates;
}

export function openContextMenu(event: unknown, templates = [], canEdit = false, selection = "") {
  const { type, value } = event.target;
  const isInput = event.target.matches("input") && (type === "text" || type === "number");
  const isTextField = canEdit || isInput || event.target.matches("textarea");
  const isSomethingSelected = selection.length > 0 || window.getSelection().toString().length > 0;

  templates.push({
    label: "Copy",
    accelerator: "CmdOrCtrl+C",
    role: "copy",
    enabled: isSomethingSelected,
  });

  // If context menu is opened on Input and there is text on the input and something is selected.
  const { selectionStart, selectionEnd } = event.target;
  if (!!value && isTextField && selectionStart !== selectionEnd) {
    templates.push({ label: "Cut", accelerator: "CmdOrCtrl+X", role: "cut" });
  }

  // If context menu is opened on Input and text is present on clipboard
  if (clipboard.readText().length > 0 && isTextField) {
    templates.push({
      label: "Paste",
      accelerator: "CmdOrCtrl+V",
      role: "paste",
    });
  }

  // If context menu is opened on Input
  if (isTextField && value) {
    templates.push({
      label: "Select All",
      accelerator: "CmdOrCtrl+A",
      role: "selectall",
    });
  }

  injectDevelopmentTemplate(event, templates);
  popupContextMenu(templates);
}

// This function is used for the markdown description on the publish page
export function openEditorMenu(codeMirror: unknown, event: unknown) {
  const value = codeMirror.doc.getValue();
  const selection = codeMirror.doc.getSelection();
  const templates = [
    {
      label: "Select All",
      accelerator: "CmdOrCtrl+A",
      role: "selectall",
      click: () => {
        codeMirror.execCommand("selectAll");
      },
      enabled: value.length > 0,
    },
    {
      label: "Cut",
      accelerator: "CmdOrCtrl+X",
      role: "cut",
      enabled: selection.length > 0,
    },
  ];
  openContextMenu(event, templates, true, selection);
}

// This function is used for the CodeViewer component
export function openSnippetMenu(codeMirror: unknown, event: unknown) {
  const value = codeMirror.doc.getValue();
  const selection = codeMirror.doc.getSelection();
  const templates = [
    {
      label: "Select All",
      accelerator: "CmdOrCtrl+A",
      role: "selectall",
      click: () => {
        codeMirror.execCommand("selectAll");
      },
      // Enabled if there is text to select
      enabled: value.length > 0,
    },
  ];
  openContextMenu(event, templates, false, selection);
}

export function openClaimPreviewMenu(claim: unknown, event: unknown) {
  // @if TARGET='app'
  const templates: unknown = [];

  if (claim) {
    const shareLink = convertToShareLink(claim.canonical_url || claim.permanent_url);
    const claimId = claim.claim_id;

    templates.push({
      label: "Copy link",
      click: () => {
        clipboard.writeText(shareLink);
      },
    });

    templates.push({ type: "separator" });

    templates.push({
      label: "Report content",
      click: () => {
        shell.openExternal(`https://lbry.com/dmca/${claimId}`);
      },
    });
  }

  injectDevelopmentTemplate(event, templates);

  if (templates.length !== 0) {
    popupContextMenu(templates);
  }
  // @endif
}

// Block context menu
export function stopContextMenu(event: unknown) {
  if (navigator.userAgent.toLowerCase().indexOf(" electron/") > -1) {
    event.preventDefault();
    event.stopPropagation();
  }
}
