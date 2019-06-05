// @flow
import React, { Suspense } from 'react';
import { stopContextMenu } from 'util/context-menu';
import analytics from 'analytics';
import(/* webpackChunkName: "videojs" */
/* webpackPreload: true */
'video.js/dist/video-js.css');

type Props = {
  source: {
    downloadPath: string,
    fileName: string,
  },
  contentType: string,
  poster?: string,
  claim: StreamClaim,
};

class AudioVideoViewer extends React.PureComponent<Props> {
  videoNode: ?HTMLVideoElement;
  player: ?{ dispose: () => void };

  componentDidMount() {
    const { contentType, poster, claim } = this.props;
    const { name, claim_id: claimId, txid, nout } = claim;
    
    // Quick fix to get file view events on lbry.tv
    // Will need to be changed to include time to start
    analytics.apiLogView(`${name}#${claimId}`, `${txid}:${nout}`, claimId);

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

    import(/* webpackChunkName: "videojs" */
    /* webpackMode: "lazy" */
    /* webpackPreload: true */
    'video.js').then(videojs => {
      if (videojs.__esModule) {
        videojs = videojs.default;
        this.player = videojs(this.videoNode, videoJsOptions, () => {});
      } else {
        throw Error('Unable to import and use videojs');
      }
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
