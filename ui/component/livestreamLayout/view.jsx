// @flow
import { BITWAVE_EMBED_URL } from 'constants/livestream';
import React from 'react';
import FileTitle from 'component/fileTitle';
import LivestreamComments from 'component/livestreamComments';

type Props = {
  uri: string,
  claim: ?StreamClaim,
  activeViewers: number,
};

export default function LivestreamLayout(props: Props) {
  const { claim, uri, activeViewers } = props;

  if (!claim) {
    return null;
  }

  return (
    <>
      <div className="section card-stack">
        <div className="file-render file-render--video livestream">
          <div className="file-viewer">
            <iframe src={`${BITWAVE_EMBED_URL}/${'doomtube'}?skin=odysee&autoplay=1`} scrolling="no" allowFullScreen />
          </div>
        </div>

        <FileTitle uri={uri} livestream activeViewers={activeViewers} />
      </div>
      <LivestreamComments uri={uri} />
    </>
  );
}
