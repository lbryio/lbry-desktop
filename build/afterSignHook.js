// See: https://medium.com/@TwitterArchiveEraser/notarize-electron-apps-7a5f988406db

const fs = require('fs');
const path = require('path');
var electron_notarize = require('electron-notarize');

module.exports = async function() {
  if (process.env.RUNNER_OS !== 'macOS') {
    return;
  }

  const appId = 'io.lbry.LBRY';
  const appPath = path.resolve(__dirname, '../dist/electron/mac/LBRY.app');

  if (!fs.existsSync(appPath)) {
    throw new Error(`Cannot find application at: ${appPath}`);
  }

  console.log(`Notarizing ${appId} found at ${appPath}`);

  try {
    await electron_notarize.notarize({
      appBundleId: appId,
      appPath: appPath,
      appleId: process.env.NOTARIZATION_USERNAME,
      appleIdPassword: process.env.NOTARIZATION_PASSWORD,
    });
  } catch (error) {
    console.error(error);
  }

  console.log(`Done notarizing ${appId}`);
};
