// @if TARGET='app'
import { remote } from 'electron';

const win = remote.getCurrentWindow();

const setProgressBar = progress => {
  win.setProgressBar(progress);
};
// @endif

// @if TARGET='web'
const setProgressBar = progress => {};
// @endif

export default setProgressBar;
