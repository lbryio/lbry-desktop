/* eslint-disable */
const path = require('path');
const fs = require('fs');
const packageJSON = require('../package.json');
const axios = require('axios');
const decompress = require('decompress');
const os = require('os');

const daemonURLTemplate = packageJSON.lbrySettings.lbrynetDaemonUrlTemplate;
const daemonVersion = packageJSON.lbrySettings.lbrynetDaemonVersion;
let currentPlatform = os.platform();
if (currentPlatform === 'darwin') currentPlatform = 'macos';
if (currentPlatform === 'win32') currentPlatform = 'windows';

const daemonURL = daemonURLTemplate
  .replace(/DAEMONVER/g, daemonVersion)
  .replace(/OSNAME/g, currentPlatform);
const tmpZipPath = 'build/daemon.zip';

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
  .then(result => {
    fs.writeFileSync(tmpZipPath, result.data);
    return true;
  })
  .then(() => {
    decompress(tmpZipPath, 'static/daemon', {
      filter: file =>
        path.basename(file.path).replace(path.extname(file.path), '') === 'lbrynet-daemon',
    });
  })
  .then(() => {
    console.log('\x1b[32msuccess\x1b[0m Daemon downloaded!');
  })
  .catch(error => {
    console.error(`\x1b[31merror\x1b[0m Daemon download failed due to: \x1b[35m${error}\x1b[0m`);
  });
