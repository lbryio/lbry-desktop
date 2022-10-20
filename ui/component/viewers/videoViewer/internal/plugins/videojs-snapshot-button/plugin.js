// @flow
import videojs from 'video.js';
import type { Player } from '../../videojs';

const VERSION = '1.0.0';
const defaultOptions = {};

type Options = {
  fileTitle: string,
  poster: string,
};

function onPlayerReady(player: Player, options: Options) {
  // this doesn't work, but it should
  const button = videojs.getComponent('Button');
  const snapshotButton = videojs.extend(button, {
    constructor: function () {
      button.apply(this, arguments);
      this.controlText('Take A Snapshot');
      this.addClass('vjs-snapshot-button');
      // camera svg
      this.el_.innerHTML =
        '<svg style="fill:#d1d1d1;height:25px;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">' +
        '<path d="M149.1 64.8L138.7 96H64C28.7 96 0 124.7 0 160V416c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7' +
        ' 64-64V160c0-35.3-28.7-64-64-64H373.3L362.9 64.8C356.4 45.2 338.1 32 317.4 32H194.6c-20.7 0-39 13.' +
        '2-45.5 32.8zM256 384c-53 0-96-43-96-96s43-96 96-96s96 43 96 96s-43 96-96 96z"/></svg>';
      this.el_.style.fill = 'white;';
      this.el_.style.height = '20px;';
    },
    handleClick: function () {
      const link = document.createElement('a');
      const video = document.querySelector('video');

      const width = player.videoWidth();
      const height = player.videoHeight();

      const canvas = Object.assign(document.createElement('canvas'), { width, height });
      // $FlowIssue
      canvas.getContext('2d').drawImage(video, 0, 0, width, height);

      link.href = canvas.toDataURL();
      link.download = options.fileTitle;

      link.click();

      link.remove();
      canvas.remove();
    },
  });
  videojs.registerComponent('snapshotButton', snapshotButton);

  player.one('canplay', function () {
    // need this for canvas to work
    // $FlowIssue
    player.children()[0].setAttribute('crossorigin', 'anonymous');
    player.getChild('controlBar').addChild('snapshotButton', {});
  });

  // TODO: this is particular to Odysee, since we don't necessarily dispose, better to use something universal
  player.on('playerClosed', function () {
    player.getChild('controlBar').removeChild('snapshotButton');
  });
}

function snapshotButton(options: Options) {
  const IS_MOBILE = videojs.browser.IS_ANDROID || videojs.browser.IS_IOS;
  if (!IS_MOBILE) {
    this.ready(() => onPlayerReady(this, videojs.mergeOptions(defaultOptions, options)));
  }
}

videojs.registerPlugin('snapshotButton', snapshotButton);
snapshotButton.VERSION = VERSION;

export default snapshotButton;
