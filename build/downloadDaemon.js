/* eslint-disable */
var https = require('https');
var path = require('path');
var fs = require('fs');
var packageJSON = require('../package.json');
var AdmZip = require('adm-zip');
var axios = require('axios');
var decompress = require('decompress');

module.exports = function (context) {
  const daemonURLTemplate = packageJSON.lbrySettings.lbrynetDaemonUrlTemplate;
  const daemonVersion = packageJSON.lbrySettings.lbrynetDaemonVersion;
  let currentPlatform = context.platform.toString();
  if (currentPlatform === 'mac') currentPlatform = 'macos';

  const daemonURL = daemonURLTemplate
    .replace(/DAEMONVER/g, daemonVersion)
    .replace(/OSNAME/g, currentPlatform);
  const tmpZipPath = 'build/daemon.zip';

  return new Promise((resolve) => {
    axios.request({
        responseType: 'arraybuffer',
        url: daemonURL,
        method: 'get',
        headers: {
          'Content-Type': 'application/zip',
        },
      })
      .then((result) => {
        fs.writeFileSync(tmpZipPath, result.data);
        return true;
      })
      .then(() => {
        return decompress(tmpZipPath, 'static/daemon', {
          filter: file => path.basename(file.path) === 'lbrynet-daemon'
        });
        // const zip = new AdmZip(tmpZipPath);
        // zip.extractEntryTo('lbrynet-daemon', 'static/daemon', false, true);
        return true;
      })
      .then(() => {
        return resolve(true);
      });
  });
};