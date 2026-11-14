// Some functions to work with the new html5 file system API:

// Wrapper for webkitGetAsEntry
// Note: webkitGetAsEntry might be renamed to GetAsEntry
const getAsEntry = (item: DataTransferItem): FileSystemEntry | undefined => {
  if (item.kind === "file" && item.webkitGetAsEntry) {
    return item.webkitGetAsEntry();
  }
};

// Get file object from fileEntry
const getFile = (fileEntry: FileSystemFileEntry): Promise<File> =>
  new Promise<File>((resolve, reject) => fileEntry.file(resolve, reject));

// Read entries from directory
const readDirectory = (directory: FileSystemDirectoryEntry): Promise<FileSystemEntry[]> | undefined => {
  // Some browsers don't support this
  if (directory.createReader !== undefined) {
    const dirReader = directory.createReader();
    return new Promise<FileSystemEntry[]>((resolve, reject) => dirReader.readEntries(resolve, reject));
  }
};

// Get file system entries from the dataTransfer items list:

const getFiles = (items: Iterable<DataTransferItem | FileSystemEntry>, directoryEntries = false): Promise<File[]> => {
  const entries: Promise<File>[] = [];

  for (const item of items) {
    const entry = (directoryEntries ? item : getAsEntry(item as DataTransferItem)) as FileSystemEntry | undefined;
    if (entry && entry.isFile) {
      const file = getFile(entry as FileSystemFileEntry);
      entries.push(file);
    }
  }

  return Promise.all(entries);
};

// Generate a valid file tree from dataTransfer:
// - Ignores directory entries
// - Ignores recursive search
export const getTree = async (dataTransfer: DataTransfer): Promise<File[] | FileList | undefined> => {
  if (dataTransfer) {
    const { items, files } = dataTransfer;
    // Handle single item drop
    if (files.length === 1) {
      const root = getAsEntry(items[0]);
      // Handle entry
      if (root) {
        // Handle directory
        if (root.isDirectory) {
          const directoryEntries = await readDirectory(root as FileSystemDirectoryEntry);
          // Get each file from the list
          return getFiles(directoryEntries, true);
        }
        // Hanlde file
        if (root.isFile) {
          const file = await getFile(root as FileSystemFileEntry);
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
