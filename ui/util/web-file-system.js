// Some functions to work with the new html5 file system API:

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

// Get file system entries from the dataTransfer items list:
export const getFiles = dataTransfer => {
  let entries = [];
  const { items } = dataTransfer;
  for (let i = 0; i < items.length; i++) {
    const entry = getAsEntry(items[i]);
    if (entry !== null && entry.isFile) {
      entries.push({ entry });
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
        const root = { entry };
        // Handle directory
        if (entry.isDirectory) {
          const directoryEntries = await readDirectory(entry);
          directoryEntries.forEach(item => {
            if (item.isFile) {
              tree.push({ entry: item, rootPath: root.path });
            }
          });
        }
        // Hanlde file
        if (entry.isFile) {
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
