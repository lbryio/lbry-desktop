const path = require('path');
const fs = require('fs');
const packageJSON = require('../package.json');
const fetch = require('node-fetch');
const decompress = require('decompress');
const os = require('os');
const del = require('del');

const downloadLBRYFirst = targetPlatform =>
  new Promise((resolve, reject) => {
    const lbryFirstURLTemplate = packageJSON.lbrySettings.LBRYFirstUrlTemplate;
    const lbryFirstVersion = packageJSON.lbrySettings.LBRYFirstVersion;
    const lbryFirstDir = path.join(__dirname, '..', packageJSON.lbrySettings.LBRYFirstDir);
    let lbryFirstFileName = packageJSON.lbrySettings.LBRYFirstFileName;

    const currentPlatform = os.platform();

    let lbryFirstPlatform = process.env.TARGET || targetPlatform || currentPlatform;
    if (lbryFirstPlatform === 'linux') lbryFirstPlatform = 'Linux';
    if (lbryFirstPlatform === 'mac' || lbryFirstPlatform === 'darwin') lbryFirstPlatform = 'Darwin';
    if (lbryFirstPlatform === 'win32' || lbryFirstPlatform === 'windows') {
      lbryFirstPlatform = 'Windows';
      lbryFirstFileName += '.exe';
    }
    const lbryFirstFilePath = path.join(lbryFirstDir, lbryFirstFileName);
    const lbryFirstVersionPath = path.join(__dirname, 'lbryFirst.ver');
    const tmpZipPath = path.join(__dirname, '..', 'dist', 'lbryFirst.zip');
    const lbryFirstURL = lbryFirstURLTemplate.replace(/LBRYFIRSTVER/g, lbryFirstVersion).replace(/OSNAME/g, lbryFirstPlatform);
    console.log('URL:', lbryFirstURL);

    // If a lbryFirst and lbryFirst.ver exists, check to see if it matches the current lbryFirst version
    const hasLbryFirstDownloaded = fs.existsSync(lbryFirstFilePath);
    const hasLbryFirstVersion = fs.existsSync(lbryFirstVersionPath);
    let downloadedLbryFirstVersion;

    if (hasLbryFirstVersion) {
      downloadedLbryFirstVersion = fs.readFileSync(lbryFirstVersionPath, 'utf8');
    }

    if (hasLbryFirstDownloaded && hasLbryFirstVersion && downloadedLbryFirstVersion === lbryFirstVersion) {
      console.log('\x1b[34minfo\x1b[0m LbryFirst already downloaded');
      resolve('Done');
    } else {
      console.log('\x1b[34minfo\x1b[0m Downloading lbryFirst...');
      fetch(lbryFirstURL, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/zip',
        },
      })
        .then(response => response.buffer())
        .then(
          result =>
            new Promise((newResolve, newReject) => {
              const distPath = path.join(__dirname, '..', 'dist');
              const hasDistFolder = fs.existsSync(distPath);

              if (!hasDistFolder) {
                fs.mkdirSync(distPath);
              }

              fs.writeFile(tmpZipPath, result, error => {
                if (error) return newReject(error);
                return newResolve();
              });
            })
        )
        .then(() => del(`${lbryFirstFilePath}*`))
        .then()
        .then(() =>
          decompress(tmpZipPath, lbryFirstDir, {
            filter: file => path.basename(file.path) === lbryFirstFileName,
          })
        )
        .then(() => {
          console.log('\x1b[32msuccess\x1b[0m LbryFirst downloaded!');
          if (hasLbryFirstVersion) {
            del(lbryFirstVersionPath);
          }

          fs.writeFileSync(lbryFirstVersionPath, lbryFirstVersion, 'utf8');
          resolve('Done');
        })
        .catch(error => {
          console.error(`\x1b[31merror\x1b[0m LbryFirst download failed due to: \x1b[35m${error}\x1b[0m`);
          reject(error);
        });
    }
  });

downloadLBRYFirst();
