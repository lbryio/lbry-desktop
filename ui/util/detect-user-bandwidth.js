const imageAddr = 'https://upload.wikimedia.org/wikipedia/commons/b/b9/Pizigani_1367_Chart_1MB.jpg';
const downloadSize = 1093957; // this must match with the image above

let startTime, endTime;
async function measureConnectionSpeed() {
  startTime = (new Date()).getTime();
  const cacheBuster = '?nnn=' + startTime;

  const download = new Image();
  download.src = imageAddr + cacheBuster;
  // this returns when the image is finished downloading
  await download.decode();
  endTime = (new Date()).getTime();
  const duration = (endTime - startTime) / 1000;
  const bitsLoaded = downloadSize * 8;
  const speedBps = (bitsLoaded / duration).toFixed(2);
  return Math.round(Number(speedBps));
}

module.exports = measureConnectionSpeed;
