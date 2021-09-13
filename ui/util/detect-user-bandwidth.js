var startTime;
var endTime;

var testConnectionSpeed = {
  imageAddr: 'https://upload.wikimedia.org/wikipedia/commons/a/a6/Brandenburger_Tor_abends.jpg', // this is just an example, you rather want an image hosted on your server
  downloadSize: 2707459, // this must match with the image above

  getConnectionSpeed: function(callback) {
    testConnectionSpeed.InitiateSpeedDetection();
    testConnectionSpeed.callback = callback;
  },
  InitiateSpeedDetection: function() {
    window.setTimeout(testConnectionSpeed.MeasureConnectionSpeed, 1);
  },
  result: function() {
    var duration = (endTime - startTime) / 1000;
    var bitsLoaded = testConnectionSpeed.downloadSize * 8;
    var speedBps = (bitsLoaded / duration).toFixed(2);
    var speedKbps = (speedBps / 1024).toFixed(2);
    var speedMbps = (speedKbps / 1024).toFixed(2);
    testConnectionSpeed.callback(speedMbps);
  },
  MeasureConnectionSpeed: function() {
    var download = new Image();
    download.onload = function() {
      endTime = (new Date()).getTime();
      testConnectionSpeed.result();
    };
    startTime = (new Date()).getTime();
    var cacheBuster = '?nnn=' + startTime;
    download.src = testConnectionSpeed.imageAddr + cacheBuster;
  },
};

// start test immediatly, you could also call this on any event or whenever you want
// testConnectionSpeed.getConnectionSpeed(function(time) { console.log(time) });

module.exports = testConnectionSpeed.getConnectionSpeed;
