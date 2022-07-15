// @flow
import * as ICONS from 'constants/icons';
import * as PAGES from 'constants/pages';
import * as MODALS from 'constants/modal_types';
import React from 'react';
import { parseURI } from 'util/lbryURI';
import ClaimPreview from 'component/claimPreview';
import Button from 'component/button';
import ClaimEffectiveAmount from 'component/claimEffectiveAmount';
import ClaimRepostAuthor from 'component/claimRepostAuthor';
import I18nMessage from 'component/i18nMessage';
import LbcSymbol from 'component/common/lbc-symbol';
import { DOMAIN } from 'config';

type Props = {
  doOpenModal: (string, {}) => void,
  query: string,
  winningUri: ?string,
  doResolveUris: (Array<string>) => void,
  hideLink?: boolean,
  setChannelActive: (boolean) => void,
  beginPublish: (?string) => void,
  pendingIds: Array<string>,
  isResolvingWinningUri: boolean,
  winningClaim: ?Claim,
  isSearching: boolean,
};

export default function SearchTopClaim(props: Props) {
  const {
    doResolveUris,
    doOpenModal,
    query = '',
    winningUri,
    winningClaim,
    hideLink = false,
    setChannelActive,
    beginPublish,
    isResolvingWinningUri,
    isSearching,
  } = props;
  const uriFromQuery = `lbry://${query}`;
  let name;
  let channelUriFromQuery;
  let winningUriIsChannel;
  try {
    const { isChannel, streamName, channelName } = parseURI(uriFromQuery);
    if (!isChannel) {
      channelUriFromQuery = `lbry://@${query}`;
      name = streamName;
    } else {
      name = channelName;
    }
  } catch (e) {}

  if (winningUri) {
    try {
      const { isChannel: winnerIsChannel } = parseURI(winningUri);
      winningUriIsChannel = winnerIsChannel;
    } catch (e) {}
  }

  React.useEffect(() => {
    setChannelActive && winningUriIsChannel && setChannelActive(true);
  }, [setChannelActive, winningUriIsChannel]);

  React.useEffect(() => {
    let urisToResolve = [];
    if (uriFromQuery) {
      urisToResolve.push(uriFromQuery);
    }

    if (channelUriFromQuery) {
      urisToResolve.push(channelUriFromQuery);
    }

    if (urisToResolve.length > 0) {
      doResolveUris(urisToResolve);
    }
  }, [doResolveUris, uriFromQuery, channelUriFromQuery]);

  return (
    <div className="search__header">
      {winningUri && (
        <div className="claim-preview__actions--header">
          <a
            className="media__uri"
            href="https://odysee.com/@OdyseeHelp:b/trending:50"
            title={__('Learn more about Credits on %DOMAIN%', { DOMAIN })}
          >
            <LbcSymbol prefix={__('Most supported')} />
          </a>
        </div>
      )}
      {winningUri && winningClaim && (
        <div className="card">
          <ClaimPreview
            hideRepostLabel
            showNullPlaceholder
            uri={winningUri}
            properties={(claim) => (
              <span className="claim-preview__custom-properties">
                <ClaimRepostAuthor short uri={winningUri} />
                <ClaimEffectiveAmount uri={winningUri} />
              </span>
            )}
          />
        </div>
      )}
      {!winningUri && (isSearching || isResolvingWinningUri) && (
        <div className="card">
          <ClaimPreview placeholder={'loading'} />
        </div>
      )}
      {!winningUri && !isSearching && !isResolvingWinningUri && uriFromQuery && (
        <div className="card card--section help--inline">
          <I18nMessage
            tokens={{
              repost: <Button button="link" onClick={() => doOpenModal(MODALS.REPOST, {})} label={__('Repost')} />,
              publish: (
                <span>
                  <Button button="link" onClick={() => beginPublish(name)} label={__('publish')} />
                </span>
              ),
            }}
          >
            You have found the edge of the internet. %repost% or %publish% your stuff here to claim this spot.
          </I18nMessage>
        </div>
      )}
      {!hideLink && winningUri && (
        <div className="section__actions--between section__actions--no-margin">
          <span />
          <Button
            button="link"
            className="search__top-link"
            label={
              <I18nMessage tokens={{ name: <strong>{query}</strong> }}>View competing uploads for %name%</I18nMessage>
            }
            navigate={`/$/${PAGES.TOP}?name=${query}`}
            iconRight={ICONS.ARROW_RIGHT}
          />
        </div>
      )}
    </div>
  );
}
