const { v4: uuid } = require('uuid');
const jsBundleId = uuid();

function getJsBundleId() {
  return jsBundleId;
}

module.exports = { getJsBundleId };
