/* eslint-disable no-console,import/no-extraneous-dependencies,import/no-commonjs */
const path = require('path');
const fs = require('fs');
const packageJSON = require('../package.json');
const axios = require('axios');
const decompress = require('decompress');
const os = require('os');
const del = require('del');

const downloadDaemon = targetPlatform =>
  new Promise((resolve, reject) => {
    const daemonURLTemplate = packageJSON.lbrySettings.lbrynetDaemonUrlTemplate;
    const daemonVersion = packageJSON.lbrySettings.lbrynetDaemonVersion;
    const daemonDir = path.join(__dirname,'..',packageJSON.lbrySettings.lbrynetDaemonDir);
    let daemonFileName = packageJSON.lbrySettings.lbrynetDaemonFileName;

    let currentPlatform = os.platform();

    var daemonPlatform = process.env.TARGET || targetPlatform || currentPlatform;
    if (daemonPlatform === 'mac' || daemonPlatform === 'darwin') daemonPlatform = 'macos';
    if (daemonPlatform === 'win32' || daemonPlatform === 'windows') {
     daemonPlatform = 'windows';
     daemonFileName = daemonFileName + '.exe';
    }
    const daemonFilePath = path.join(daemonDir, daemonFileName);
    const daemonVersionPath = path.join(__dirname, 'daemon.ver');
    const tmpZipPath = path.join(__dirname, '..', 'dist', 'daemon.zip');
    const daemonURL = daemonURLTemplate
      .replace(/DAEMONVER/g, daemonVersion)
      .replace(/OSNAME/g, daemonPlatform);

    // If a daemon and daemon.ver exists, check to see if it matches the current daemon version
    const hasDaemonDownloaded = fs.existsSync(daemonFilePath);
    const hasDaemonVersion = fs.existsSync(daemonVersionPath);
    let downloadedDaemonVersion;
    if (hasDaemonVersion) {
      downloadedDaemonVersion = fs.readFileSync(daemonVersionPath, "utf8");
    }

    if (hasDaemonDownloaded && hasDaemonVersion && downloadedDaemonVersion === daemonVersion) {
      console.log('\x1b[34minfo\x1b[0m Daemon already downloaded');
      resolve('Done');
      return;
    } else {
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
              const distPath = path.join(__dirname, '..', 'dist');
              const hasDistFolder = fs.existsSync(distPath);

              if (!hasDistFolder) {
                fs.mkdirSync(distPath);
              }

              fs.writeFile(tmpZipPath, result.data, error => {
                if (error) return newReject(error);
                return newResolve();
              });
          })
        )
        .then(() => del(`${daemonFilePath}*`))
        .then(() => decompress(tmpZipPath, daemonDir, {
          filter: file =>
            path.basename(file.path) === daemonFileName,
        }))
        .then(() => {
          console.log('\x1b[32msuccess\x1b[0m Daemon downloaded!');
          if (hasDaemonVersion) {
            del(daemonVersionPath);
          }

          fs.writeFileSync(daemonVersionPath, daemonVersion, "utf8")
          resolve('Done');
        })
        .catch(error => {
          console.error(
            `\x1b[31merror\x1b[0m Daemon download failed due to: \x1b[35m${error}\x1b[0m`
          );
          reject(error);
        })
      };
  });

module.exports = downloadDaemon;

require('make-runnable/custom')({
  printOutputFrame: false
});
