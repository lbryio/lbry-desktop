import { remote } from 'electron';

const win = remote.getCurrentWindow();

const setProgressBar = progress => {
  win.setProgressBar(progress);
};

export default setProgressBar;
