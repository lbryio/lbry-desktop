/* eslint-disable no-console,import/no-extraneous-dependencies,import/no-commonjs */
const path = require('path');
const fs = require('fs-path');
const packageJSON = require('../package.json');
const axios = require('axios');
const decompress = require('decompress');
const os = require('os');
const del = require('del');

const downloadDaemon = targetPlatform =>
  new Promise((resolve, reject) => {
    const daemonURLTemplate = packageJSON.lbrySettings.lbrynetDaemonUrlTemplate;
    const daemonVersion = packageJSON.lbrySettings.lbrynetDaemonVersion;
    const daemonDir = packageJSON.lbrySettings.lbrynetDaemonDir;
    const daemonFileName = packageJSON.lbrySettings.lbrynetDaemonFileName;

    let currentPlatform = os.platform();
    if (currentPlatform === 'darwin') currentPlatform = 'macos';
    if (currentPlatform === 'win32') currentPlatform = 'windows';

    const daemonPlatform = targetPlatform || currentPlatform;

    const daemonURL = daemonURLTemplate
      .replace(/DAEMONVER/g, daemonVersion)
      .replace(/OSNAME/g, daemonPlatform);
    const tmpZipPath = 'dist/daemon.zip';

    console.log('\x1b[34minfo\x1b[0m Downloading daemon...');
    axios
      .request({
        responseType: 'arraybuffer',
        url: daemonURL,
        method: 'get',
        headers: {
          'Content-Type': 'application/zip',
        },
      })
      .then(
        result =>
          new Promise((newResolve, newReject) => {
            fs.writeFile(tmpZipPath, result.data, error => {
              if (error) return newReject(error);
              return newResolve();
            });
          })
      )
      .then(() => del(`${daemonDir}/${daemonFileName}*`))
      .then(() =>
        decompress(tmpZipPath, daemonDir, {
          filter: file =>
            path.basename(file.path).replace(path.extname(file.path), '') === daemonFileName,
        })
      )
      .then(() => {
        console.log('\x1b[32msuccess\x1b[0m Daemon downloaded!');
        resolve(true);
      })
      .catch(error => {
        console.error(
          `\x1b[31merror\x1b[0m Daemon download failed due to: \x1b[35m${error}\x1b[0m`
        );
        reject(error);
      });
  });

module.exports = downloadDaemon;

require('make-runnable/custom')({
  printOutputFrame: false
});
