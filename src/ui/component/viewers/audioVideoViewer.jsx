// @flow
import type { Claim } from 'types/claim';
import React from 'react';
import { stopContextMenu } from 'util/context-menu';
import(
    /* webpackChunkName: "videojs" */
    /* webpackPreload: true */
    'video.js/dist/video-js.css'
);

type Props = {
  source: {
    downloadPath: string,
    fileName: string,
  },
  contentType: string,
  poster?: string,
  claim: Claim,
};

class AudioVideoViewer extends React.PureComponent<Props> {
  videoNode: ?HTMLVideoElement;
  player: ?{ dispose: () => void };

  componentDidMount() {
    const me = this;
    const { contentType, poster, claim } = me.props;

    const path = `https://api.lbry.tv/content/claims/${claim.name}/${claim.claim_id}/stream.mp4`;
    const sources = [
      {
        src: path,
        type: contentType,
      },
    ];

    const videoJsOptions = {
      autoplay: true,
      controls: true,
      preload: 'auto',
      poster,
      sources,
    };

    import(
        /* webpackChunkName: "videojs" */
        /* webpackMode: "lazy" */
        /* webpackPreload: true */
        'video.js'
    ).then((videojs) => {
      me.player = videojs(me.videoNode, videoJsOptions, () => {});
    });
  }

  componentWillUnmount() {
    if (this.player) {
      this.player.dispose();
    }
  }

  render() {
    return (
      <div className="file-render__viewer" onContextMenu={stopContextMenu}>
        <div data-vjs-player>
          <video ref={node => (this.videoNode = node)} className="video-js" />
        </div>
      </div>
    );
  }
}

export default AudioVideoViewer;
