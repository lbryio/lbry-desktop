const uuid = require('uuid/v4');
const jsBundleId = uuid();

function getJsBundleId() {
  return jsBundleId;
}

module.exports = { getJsBundleId };
