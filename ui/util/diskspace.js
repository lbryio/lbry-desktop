const { exec } = require('child_process');

export const diskSpaceLinux = (path) => {
  return new Promise((resolve, reject) => {
    exec(`df ${path}`, (error, stdout, stderr) => {
      if (error) {
        console.log(`error: ${error.message}`);
        return reject();
      }
      if (stderr) {
        return reject();
      }
      resolve(stdout);
    });
  });
};

// export diskSpaceWindows = (path) => {
//   new Promise((resolve, reject) => {
//
//   });
// }
