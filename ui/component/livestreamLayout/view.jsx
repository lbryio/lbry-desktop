// @flow
import { LIVESTREAM_EMBED_URL } from 'constants/livestream';
import React from 'react';
import FileTitleSection from 'component/fileTitleSection';
import LivestreamComments from 'component/livestreamComments';
import { useIsMobile } from 'effects/use-screensize';

type Props = {
  uri: string,
  claim: ?StreamClaim,
  isLive: boolean,
  chatDisabled: boolean,
};

export default function LivestreamLayout(props: Props) {
  const { claim, uri, isLive, chatDisabled } = props;
  const isMobile = useIsMobile();

  if (!claim || !claim.signing_channel) {
    return null;
  }

  const channelName = claim.signing_channel.name;
  const channelClaimId = claim.signing_channel.claim_id;

  return (
    <>
      <div className="section card-stack">
        <div className="file-render file-render--video livestream">
          <div className="file-viewer">
            <iframe
              src={`${LIVESTREAM_EMBED_URL}/${channelClaimId}?skin=odysee&autoplay=1`}
              scrolling="no"
              allowFullScreen
            />
          </div>
        </div>

        {Boolean(chatDisabled) && (
          <div className="help--notice">
            {channelName
              ? __('%channelName% has disabled chat for this stream. Enjoy the stream!', { channelName })
              : __('This channel has disabled chat for this stream. Enjoy the stream!')}
          </div>
        )}

        {!isLive && (
          <div className="help--notice">
            {channelName
              ? __("%channelName% isn't live right now, but the chat is! Check back later to watch the stream.", {
                  channelName,
                })
              : __("This channel isn't live right now, but the chat is! Check back later to watch the stream.")}
          </div>
        )}

        {isMobile && <LivestreamComments uri={uri} />}

        <FileTitleSection uri={uri} livestream isLive={isLive} />
      </div>
    </>
  );
}
