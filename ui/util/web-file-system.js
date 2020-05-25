// Some functions to work with the new html5 file system API:

// Wrapper for webkitGetAsEntry
// Note: webkitGetAsEntry might be renamed to GetAsEntry
const getAsEntry = item => {
  if (item.kind === 'file' && item.webkitGetAsEntry) {
    return item.webkitGetAsEntry();
  }
};

// Get file object from fileEntry
const getFile = fileEntry => new Promise((resolve, reject) => fileEntry.file(resolve, reject));

// Read entries from directory
const readDirectory = directory => {
  // Some browsers don't support this
  if (directory.createReader !== undefined) {
    let dirReader = directory.createReader();
    return new Promise((resolve, reject) => dirReader.readEntries(resolve, reject));
  }
};

// Get file system entries from the dataTransfer items list:

const getFiles = (items, directoryEntries = false) => {
  let entries = [];

  for (let item of items) {
    const entry = directoryEntries ? item : getAsEntry(item);
    if (entry && entry.isFile) {
      const file = getFile(entry);
      entries.push(file);
    }
  }

  return Promise.all(entries);
};

// Generate a valid file tree from dataTransfer:
// - Ignores directory entries
// - Ignores recursive search
export const getTree = async dataTransfer => {
  if (dataTransfer) {
    const { items, files } = dataTransfer;
    // Handle single item drop
    if (files.length === 1) {
      const root = getAsEntry(items[0]);
      // Handle entry
      if (root) {
        // Handle directory
        if (root.isDirectory) {
          const directoryEntries = await readDirectory(root);
          // Get each file from the list
          return getFiles(directoryEntries, true);
        }
        // Hanlde file
        if (root.isFile) {
          const file = await getFile(root);
          return [file];
        }
      } else {
        // Some files have hidden dataTransfer items:
        // Use the default file object instead
        return files;
      }
    }
    // Handle multiple items drop
    if (files.length > 1) {
      // Convert items to fileEntry and filter files
      return getFiles(items);
    }
  }
};
