const fs = require('fs');
const path = require('path');

async function getTempFile(ctx) {
  const filename = ctx.params.filename;
  return fs.readFileSync(path.join(__dirname, `/../dist/${filename}`), 'utf8');
}

module.exports = { getTempFile };
