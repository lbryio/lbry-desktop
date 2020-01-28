const fs = require('fs');

module.exports = async function(params) {
  const { artifactPaths } = params;

  for (var i = 0; i < artifactPaths.length; i++) {
    const artifactPath = artifactPaths[i];
    if (artifactPath.includes('.blockmap') || artifactPath.includes('.zip')) {
      fs.unlinkSync(artifactPath);
    }
  }
};
