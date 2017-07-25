const { remote } = require("electron");
const application = remote.app;
const win = remote.getCurrentWindow();

const setProgressBar = progress => {
  win.setProgressBar(progress);
};

export default setProgressBar;
