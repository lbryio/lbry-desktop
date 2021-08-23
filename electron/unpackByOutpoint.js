import fs from 'fs';
import path from 'path';
import { unpackDirectory } from 'lbry-format';

async function unpackByOutpoint(lbry, outpoint) {
  const { items: claimFiles } = await lbry.file_list({ outpoint, full_status: true, page: 1, page_size: 1 });

  if (claimFiles && claimFiles.length) {
    const claimFileInfo = claimFiles[0];
    const packFilePath = path.resolve(claimFileInfo.download_path);
    const unpackPath = path.normalize(path.join(claimFileInfo.download_directory, claimFileInfo.claim_name));

    if (!fs.existsSync(unpackPath)) {
      await unpackDirectory(unpackPath, {
        fileName: packFilePath,
      });
    }

    return unpackPath;
  }
}

export default unpackByOutpoint;
