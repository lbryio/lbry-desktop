// @flow

import type { FileInfo } from 'types/file_info';

export function calculateDownloadProgress(fileInfo: FileInfo) {
  return fileInfo.written_bytes ? (fileInfo.written_bytes / fileInfo.total_bytes) * 100 : 0;
}
