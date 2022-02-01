// @flow
import { LIVESTREAM_EMBED_URL } from 'constants/livestream';
import LivestreamScheduledInfo from 'component/livestreamScheduledInfo';
import React from 'react';
import classnames from 'classnames';

type Props = {
  channelClaimId: string,
  release?: any,
  showLivestream: boolean,
  showScheduledInfo?: boolean,
  mobileVersion?: boolean,
};

export default function LivestreamIframeRender(props: Props) {
  const { channelClaimId, release, showLivestream, showScheduledInfo, mobileVersion } = props;

  const className = mobileVersion
    ? 'file-render file-render--video'
    : classnames('file-render file-render--video livestream', {
        'file-render--scheduledLivestream': !showLivestream,
      });

  return (
    <div className={className}>
      <div className="file-viewer">
        {showLivestream && (
          <iframe
            src={`${LIVESTREAM_EMBED_URL}/${channelClaimId}?skin=odysee&autoplay=1`}
            scrolling="no"
            allowFullScreen
          />
        )}

        {showScheduledInfo && release && <LivestreamScheduledInfo release={release} />}
      </div>
    </div>
  );
}
