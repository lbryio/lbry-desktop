/* eslint-disable no-console,import/no-extraneous-dependencies,import/no-commonjs */

/**
 * This script is necessary for checking that the daemon that has been downloaded during the
 * yarn installing process is the one for the building target. For example, on Travis the
 * Windows package is built on Linux, thus yarn will download the daemon for Linux instead of
 * Windows. The script will test that and then download the right daemon for the targeted platform.
 */
const os = require('os');
const downloadDaemon = require('./downloadDaemon');

module.exports = context => {

  let currentPlatform = os.platform();
  if (currentPlatform === 'darwin') currentPlatform = 'macoss';
  if (currentPlatform === 'win32') currentPlatform = 'windows';

  let buildingPlatformTarget = context.platform.toString();
  if (buildingPlatformTarget === 'mac') buildingPlatformTarget = 'macos';

  if (buildingPlatformTarget !== currentPlatform) {
    console.log(
      "\x1b[34minfo\x1b[0m Daemon platform doesn't match target platform. Redownloading the daemon."
    );

    return downloadDaemon(buildingPlatformTarget);
  }
  return Promise.resolve();
};
