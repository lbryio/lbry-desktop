const fs = require('fs');
const path = require('path');

let tempFile;
async function getTempFile(ctx) {
  const filename = ctx.params.filename;
  if (!tempFile) {
    tempFile = fs.readFileSync(path.join(__dirname, `/../dist/${filename}`), 'utf8');
  }
  return tempFile;
}

module.exports = { getTempFile };
