// @if TARGET='app'
const AutoLaunch = require('auto-launch');

export const launcher = new AutoLaunch({
  name: 'lbry',
  isHidden: true,
});
// @endif
