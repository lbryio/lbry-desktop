// @flow
import { lazyImport } from 'util/lazyImport';
import { useIsMobile } from 'effects/use-screensize';
import FileTitleSection from 'component/fileTitleSection';
import LivestreamLink from 'component/livestreamLink';
import React from 'react';
import { PRIMARY_PLAYER_WRAPPER_CLASS } from 'page/file/view';
import FileRenderInitiator from 'component/fileRenderInitiator';
import LivestreamIframeRender from './iframe-render';

const LivestreamChatLayout = lazyImport(() => import('component/livestreamChatLayout' /* webpackChunkName: "chat" */));

type Props = {
  activeStreamUri: boolean | string,
  claim: ?StreamClaim,
  hideComments: boolean,
  isCurrentClaimLive: boolean,
  release: any,
  showLivestream: boolean,
  showScheduledInfo: boolean,
  uri: string,
};

export default function LivestreamLayout(props: Props) {
  const {
    activeStreamUri,
    claim,
    hideComments,
    isCurrentClaimLive,
    release,
    showLivestream,
    showScheduledInfo,
    uri,
  } = props;

  const isMobile = useIsMobile();

  if (!claim || !claim.signing_channel) return null;

  const { name: channelName, claim_id: channelClaimId } = claim.signing_channel;

  return (
    <>
      <div className="section card-stack">
        <React.Suspense fallback={null}>
          {isMobile && isCurrentClaimLive ? (
            <div className={PRIMARY_PLAYER_WRAPPER_CLASS}>
              {/* Mobile needs to handle the livestream player like any video player */}
              <FileRenderInitiator uri={uri} />
            </div>
          ) : (
            <LivestreamIframeRender
              channelClaimId={channelClaimId}
              release={release}
              showLivestream={showLivestream}
              showScheduledInfo={showScheduledInfo}
            />
          )}
        </React.Suspense>

        {hideComments && !showScheduledInfo && (
          <div className="help--notice">
            {channelName
              ? __('%channel% has disabled chat for this stream. Enjoy the stream!', { channel: channelName })
              : __('This channel has disabled chat for this stream. Enjoy the stream!')}
          </div>
        )}

        {!activeStreamUri && !showScheduledInfo && !isCurrentClaimLive && (
          <div className="help--notice">
            {channelName
              ? __("%channelName% isn't live right now, but the chat is! Check back later to watch the stream.", {
                  channelName,
                })
              : __("This channel isn't live right now, but the chat is! Check back later to watch the stream.")}
          </div>
        )}

        {activeStreamUri && (
          <LivestreamLink
            title={__("Click here to access the stream that's currently active")}
            claimUri={activeStreamUri}
          />
        )}

        {isMobile && !hideComments && (
          <React.Suspense fallback={null}>
            <LivestreamChatLayout uri={uri} />
          </React.Suspense>
        )}

        <FileTitleSection uri={uri} livestream isLive={showLivestream} />
      </div>
    </>
  );
}
