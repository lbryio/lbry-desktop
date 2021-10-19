// @flow
import ChannelMentionSuggestion from 'component/channelMentionSuggestion';
import LbcSymbol from 'component/common/lbc-symbol';
import React from 'react';

type Props = {
  uriFromQuery: string,
  winningUri: string,
  isResolvingUri: boolean,
  shownUris: Array<string>,
  setMostSupported: (string) => void,
  doResolveUri: (string) => void,
};

export default function ChannelMentionTopSuggestion(props: Props) {
  const { uriFromQuery, winningUri, isResolvingUri, shownUris, setMostSupported, doResolveUri } = props;

  React.useEffect(() => {
    if (uriFromQuery) doResolveUri(uriFromQuery);
  }, [doResolveUri, uriFromQuery]);

  React.useEffect(() => {
    if (winningUri) setMostSupported(winningUri);
  }, [setMostSupported, winningUri]);

  if (isResolvingUri) {
    return (
      <div className="channel-mention__winning-claim">
        <div className="channel-mention__label channel-mention__placeholder-label" />

        <div className="channel-mention__suggestion channel-mention__placeholder-suggestion">
          <div className="channel-mention__placeholder-thumbnail" />
          <div className="channel-mention__placeholder-info" />
        </div>
        <hr className="channel-mention__top-separator" />
      </div>
    );
  }

  return !winningUri || shownUris.includes(winningUri) ? null : (
    <>
      <div className="channel-mention__label">
        <LbcSymbol prefix={__('Most Supported')} />
      </div>
      <ChannelMentionSuggestion uri={winningUri} />
      <hr className="channel-mention__top-separator" />
    </>
  );
}
