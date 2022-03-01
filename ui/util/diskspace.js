const { exec } = require('child_process');

export const diskSpaceLinux = (path) => {
  return new Promise((resolve, reject) => {
    exec(`df ${path}`, (error, stdout, stderr) => {
      if (error) {
        return reject(error);
      }
      if (stderr) {
        return reject(new Error(stderr));
      }
      // Sample df command output:
      // Filesystem     1K-blocks      Used Available Use% Mounted on
      // C:\            185087700 120552556  64535144  66% /mnt/c
      const dfResult = stdout.split('\n')[1].split(/\s+/);
      resolve({
        total: dfResult[1],
        free: dfResult[3],
      });
    });
  });
};

export const diskSpaceMac = (path) => {
  // Escape spaces in path to prevent errors.
  // Example:
  // "/Users/username/Library/Application Support/LBRY" gets updated to
  // "/Users/username/Library/Application\\ Support/LBRY"
  const escapedPath = path.replace(/(\s+)/g, '\\$1');
  return diskSpaceLinux(escapedPath);
};

export const diskSpaceWindows = (path) => {
  return new Promise((resolve, reject) => {
    exec(`wmic logicaldisk get size,freespace,caption`, (error, stdout, stderr) => {
      if (error) {
        return reject(error);
      }
      if (stderr) {
        return reject(new Error(stderr));
      }

      // Drive used in the path (ie, C:, D:, etc.)
      const pathDrive = path.split(':')[0] + ':';

      // Sample outout:
      // Caption  FreeSpace    Size
      // C:       66218471424  189529804800
      // D:
      // E:       536829952    536854528
      const stdoutLines = stdout.split('\n');
      // Find the drive used in the path.
      const driveLine = stdoutLines.find((line) => line.startsWith(pathDrive));
      // Parse the values in each column by filtering out the
      // empty spaces.
      // eslint-disable-next-line no-unused-vars
      const [drive, freeSpace, totalSize] = driveLine.split(' ').filter((x) => x);

      resolve({
        total: totalSize,
        free: freeSpace,
      });
    });
  });
};
