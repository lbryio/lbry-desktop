const { Octokit } = require('@octokit/rest');
const octokit = new Octokit();
var wget = require('node-wget');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const readline = require('readline');

// Global generated from cli prompt
let versionToSign;

// Why can't I do this with 'fs'? :/
function deleteFolderRecursive(path) {
  if (fs.existsSync(path)) {
    fs.readdirSync(path).forEach(function(file, index) {
      var curPath = path + '/' + file;
      if (fs.lstatSync(curPath).isDirectory()) {
        // recurse
        deleteFolderRecursive(curPath);
      } else {
        // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
}

// Initial setup
// Create a file to store the hashes (creates a new copy if one exists)
const downloadPath = path.resolve(__dirname, '../dist/releaseDownloads');
const fileToSign = path.resolve(downloadPath, '../hashes.txt');

fs.openSync(fileToSign, 'w');

if (!fs.existsSync(downloadPath)) {
  fs.mkdirSync(downloadPath);
} else {
  deleteFolderRecursive(downloadPath);
  fs.mkdirSync(downloadPath);
}

//
// Below is the actual code that downloads, hashes, and signs the release
//
function cleanUpAfterSigning() {
  fs.unlinkSync(fileToSign);
  deleteFolderRecursive(downloadPath);
  console.log('Good to go captain');
  process.exit(0);
}

function signFile() {
  console.log('Logging in file with hashes using keybase...');
  // All files are hashed and added to hashes.txt
  // Sign it with keybase
  const fileName = `LBRY_${versionToSign}_sigs.asc`;

  const pathForSignedFile = path.resolve(__dirname, `../dist/${fileName}`);
  exec(`keybase pgp sign -i ${fileToSign} -c -o ${pathForSignedFile}`, err => {
    if (err) {
      console.log('Error signing file with keybase');
    }

    cleanUpAfterSigning();
  });
}

function hashFiles() {
  console.log('Hashing assets downloaded from github...');

  fs.readdir(downloadPath, function(err, items) {
    if (err) {
      console.log('Error signing files in ', downloadPath);
    }

    let count = 0;
    for (var i = 0; i < items.length; i++) {
      const file = items[i];
      const filePath = path.resolve(__dirname, '../dist/releaseDownloads/', file);
      exec(`sha256sum ${filePath}`, (err, stdout) => {
        if (err) {
          console.log('Error hashing ', filePath);
        }

        count += 1;
        const hash = stdout.split(' ')[0];
        const stringToAppend = `${hash} ${file}\n`;
        fs.appendFileSync(fileToSign, stringToAppend);

        if (count === items.length - 1) {
          signFile();
        }
      });
    }
  });
}

let downloadCount = 0;
let fileCountToDownload;
function downloadFile(fileName, url) {
  wget(
    {
      url: url,
      dest: `${downloadPath}/`,
    },
    (error, response, body) => {
      console.log(`Finished downloading `, fileName);
      downloadCount += 1;

      if (downloadCount === fileCountToDownload) {
        hashFiles();
      }
    }
  );
}

function downloadAssets() {
  console.log('Downloading release assets...');
  octokit.repos
    .getReleaseByTag({
      owner: 'lbryio',
      repo: 'lbry-desktop',
      tag: versionToSign,
    })
    .then(({ data }) => {
      const release_id = data.id;

      return octokit.repos.listReleases({
        owner: 'lbryio',
        repo: 'lbry-desktop',
        release_id,
      });
    })
    .then(({ data }) => {
      const releaseToDownload = data.filter(releaseData => releaseData.tag_name === versionToSign)[0];
      const assets = releaseToDownload.assets;
      fileCountToDownload = assets.length;
      assets
        .map(({ browser_download_url, name }) => ({ download_url: browser_download_url, name }))
        .forEach(({ name, download_url }) => {
          const fileName = path.resolve(__dirname, `../dist/releaseDownloads/${name}`);
          downloadFile(fileName, download_url);
        });
    })
    .catch(error => console.log('Error downloading releases ', error));
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question('Version to sign: ', function(version) {
  const tag = version.startsWith('v') ? version : `v${version}`;
  versionToSign = tag;
  downloadAssets();
});
