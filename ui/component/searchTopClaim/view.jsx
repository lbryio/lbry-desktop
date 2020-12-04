// @flow
import * as ICONS from 'constants/icons';
import * as PAGES from 'constants/pages';
import React from 'react';
import { parseURI } from 'lbry-redux';
import ClaimPreview from 'component/claimPreview';
import Button from 'component/button';
import ClaimEffectiveAmount from 'component/claimEffectiveAmount';
import I18nMessage from 'component/i18nMessage';
import { useHistory } from 'react-router';
import LbcSymbol from 'component/common/lbc-symbol';
import { DOMAIN } from 'config';

type Props = {
  query: string,
  winningUri: ?Claim,
  doResolveUris: (Array<string>) => void,
  hideLink?: boolean,
  beginPublish: string => void,
  pendingIds: Array<string>,
};

export default function SearchTopClaim(props: Props) {
  const { doResolveUris, query = '', winningUri, hideLink = false, beginPublish, pendingIds } = props;
  // without pulling in pendingIds, it doesn't update the search component...
  const uriFromQuery = `lbry://${query}`;
  const queryName = query[0] === '@' ? query.slice(1) : query;
  const { push } = useHistory();
  let name;
  let channelUriFromQuery;
  try {
    const { isChannel, streamName, channelName } = parseURI(uriFromQuery);

    if (!isChannel) {
      channelUriFromQuery = `lbry://@${query}`;
      name = streamName;
    } else {
      name = channelName;
    }
  } catch (e) {}

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
    <section className="search">
      <header className="search__header">
        {winningUri && (
          <div className="claim-preview__actions--header">
            <a
              className="help"
              href="https://lbry.com/faq/trending"
              title={__('Learn more about LBRY Credits on %DOMAIN%', { DOMAIN })}
            >
              <I18nMessage
                tokens={{
                  lbc: <LbcSymbol />,
                }}
              >
                Most supported %lbc%
              </I18nMessage>
            </a>
          </div>
        )}
        {winningUri && (
          <div className="card">
            <ClaimPreview
              hideRepostLabel
              uri={winningUri}
              type="large"
              placeholder="publish"
              properties={claim => (
                <span className="claim-preview__custom-properties">
                  <ClaimEffectiveAmount uri={winningUri} />
                </span>
              )}
            />
          </div>
        )}
        {!winningUri && uriFromQuery && (
          <div className={'empty empty--centered'}>
            <I18nMessage
              tokens={{
                repost: (
                  <Button
                    button="link"
                    onClick={() => push(`/$/${PAGES.REPOST_NEW}?rto=${name}`)}
                    label={__('repost')}
                  />
                ),
                publish: <Button button="link" onClick={() => beginPublish(name)} label={'publish'} />,
                name: <strong>name</strong>,
              }}
            >
              What should be here? You can %repost% or %publish% to %name%.
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
      </header>
    </section>
  );
}
