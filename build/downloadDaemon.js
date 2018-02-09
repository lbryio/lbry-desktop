/* eslint-disable */
const path = require('path');
const fs = require('fs');
const packageJSON = require('../package.json');
const axios = require('axios');
const decompress = require('decompress');

module.exports = function(context) {
  const daemonURLTemplate = packageJSON.lbrySettings.lbrynetDaemonUrlTemplate;
  const daemonVersion = packageJSON.lbrySettings.lbrynetDaemonVersion;
  let currentPlatform = context.platform.toString();
  if (currentPlatform === 'mac') currentPlatform = 'macos';

  const daemonURL = daemonURLTemplate
    .replace(/DAEMONVER/g, daemonVersion)
    .replace(/OSNAME/g, currentPlatform);
  const tmpZipPath = 'build/daemon.zip';
  console.log(daemonURL);

  return new Promise(resolve => {
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
        return decompress(tmpZipPath, 'static/daemon', {
          filter: file => path.basename(file.path).replace(path.extname(file.path), '') === 'lbrynet-daemon',
        });
      })
      .then(() => {
        return resolve(true);
      });
  });
};
