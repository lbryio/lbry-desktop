// Some functions to work with the new html5 file system API:
import path from 'path';

// Wrapper for webkitGetAsEntry
// Note: webkitGetAsEntry might be renamed to GetAsEntry
const getAsEntry = item => {
  if (item.kind === 'file' && item.webkitGetAsEntry) {
    return item.webkitGetAsEntry();
  }
  return null;
};

// Read entries from directory
const readDirectory = directory => {
  let dirReader = directory.createReader();

  return new Promise((resolve, reject) => {
    dirReader.readEntries(
      results => {
        if (results.length) {
          resolve(results);
        } else {
          reject();
        }
      },
      error => reject(error)
    );
  });
};

// Some files hide more that one dataTransferItem:
// This is a safe way to get the absolute path on electron
const getFilePath = (name, files) => {
  let filePath = null;
  for (let file of files) {
    if (file.name === name) {
      filePath = file.path;
      break;
    }
  }
  return filePath;
};

// Get only files from the dataTransfer items list
export const getFiles = dataTransfer => {
  let entries = [];
  const { items, files } = dataTransfer;
  for (let i = 0; i < items.length; i++) {
    const entry = getAsEntry(items[i]);
    if (entry !== null && entry.isFile) {
      // Has valid path
      const filePath = getFilePath(entry.name, files);
      if (filePath) {
        entries.push({ entry, filePath });
      }
    }
  }
  return entries;
};

// Generate a valid file tree from dataTransfer:
// - Ignores directory entries
// - Ignores recursive search
export const getTree = async dataTransfer => {
  let tree = [];
  if (dataTransfer) {
    const { items, files } = dataTransfer;
    // Handle single item drop
    if (files.length === 1) {
      const entry = getAsEntry(items[0]);
      // Handle entry
      if (entry) {
        const root = { entry, path: files[0].path };
        // Handle directory
        if (root.entry.isDirectory) {
          const directoryEntries = await readDirectory(root.entry);
          directoryEntries.forEach(item => {
            if (item.isFile) {
              tree.push({ entry: item, path: path.join(root.path, item.name) });
            }
          });
        }
        // Hanlde file
        if (root.entry.isFile) {
          tree.push(root);
        }
      }
    }
    // Handle multiple items drop
    if (files.length > 1) {
      tree = tree.concat(getFiles(dataTransfer));
    }
  }
  return tree;
};
