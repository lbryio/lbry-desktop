import * as ICONS from 'constants/icons';
import * as PAGES from 'constants/pages';
import React from 'react';
import { parseURI } from 'util/lbryURI';
import ClaimPreview from 'component/claimPreview';
import Button from 'component/button';
import ClaimEffectiveAmount from 'component/claimEffectiveAmount';
import ClaimRepostAuthor from 'component/claimRepostAuthor';
import I18nMessage from 'component/i18nMessage';
import { useHistory } from 'react-router';
import LbcSymbol from 'component/common/lbc-symbol';
import { DOMAIN } from 'config';

type Props = {
  query: string,
  winningUri: string | null | undefined,
  doResolveUris: (arg1: Array<string>) => void,
  hideLink?: boolean,
  setChannelActive: (arg1: boolean) => void,
  beginPublish: (arg1?: string | null | undefined) => void,
  pendingIds: Array<string>,
  isResolvingWinningUri: boolean,
  winningClaim: Claim | null | undefined,
  isSearching: boolean
};

export default function SearchTopClaim(props: Props) {
  const {
    doResolveUris,
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
  const { push } = useHistory();
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
  } catch (e: any) {}

  if (winningUri) {
    try {
      const { isChannel: winnerIsChannel } = parseURI(winningUri);
      winningUriIsChannel = winnerIsChannel;
    } catch (e: any) {}
  }

  React.useEffect(() => {
    setChannelActive && winningUriIsChannel && setChannelActive(true);
  }, [setChannelActive, winningUriIsChannel]);

  React.useEffect(() => {
    let urisToResolve: unknown = [];
    if (uriFromQuery) {
// @ts-expect-error - TS2339 - Property 'push' does not exist on type 'unknown'.
      urisToResolve.push(uriFromQuery);
    }

    if (channelUriFromQuery) {
// @ts-expect-error - TS2339 - Property 'push' does not exist on type 'unknown'.
      urisToResolve.push(channelUriFromQuery);
    }

// @ts-expect-error - TS2339 - Property 'length' does not exist on type 'unknown'.
    if (urisToResolve.length > 0) {
// @ts-expect-error - TS2345 - Argument of type 'unknown' is not assignable to parameter of type 'string[]'.
      doResolveUris(urisToResolve);
    }
  }, [doResolveUris, uriFromQuery, channelUriFromQuery]);

  return (
    <div className="search__header">
      {winningUri && (
        <div className="claim-preview__actions--header">
          <a
            className="media__uri"
            href="https://lbry.com/faq/trending"
            title={__('Learn more about LBRY Credits on %DOMAIN%', { DOMAIN })}
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
          {/* @ts-expect-error - TS2745 (ts-migration) */}
          <I18nMessage
            // @ts-expect-error - TS2322 (ts-migration)
            tokens={{
              repost: (
                <Button
                  // @ts-expect-error - TS2322 (ts-migration)
                  button="link"
                  onClick={() => push(`/$/${PAGES.REPOST_NEW}${name ? `?to=${name}` : ''}`)}
                  label={__('Repost')}
                />
              ),
              publish: (
                <span>
                  {/* @ts-expect-error - TS2322 (ts-migration) */}
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
            // @ts-expect-error - TS2322 (ts-migration)
            button="link"
            className="search__top-link"
            label={
              // @ts-expect-error - TS2745, TS2322 (ts-migration)
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
