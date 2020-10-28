// @flow
import * as ICONS from 'constants/icons';
import * as PAGES from 'constants/pages';
import React from 'react';
import { parseURI } from 'lbry-redux';
import ClaimPreview from 'component/claimPreview';
import Button from 'component/button';
import ClaimEffectiveAmount from 'component/claimEffectiveAmount';
import HelpLink from 'component/common/help-link';
import I18nMessage from 'component/i18nMessage';

type Props = {
  query: string,
  winningUri: ?Claim,
  doResolveUris: (Array<string>) => void,
  hideLink?: boolean,
};

export default function SearchTopClaim(props: Props) {
  const { doResolveUris, query = '', winningUri, hideLink = false } = props;
  const uriFromQuery = `lbry://${query}`;

  let channelUriFromQuery;
  try {
    const { isChannel } = parseURI(uriFromQuery);

    if (!isChannel) {
      channelUriFromQuery = `lbry://@${query}`;
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

  if (!winningUri) {
    return null;
  }

  return (
    <section className="search">
      <header className="search__header">
        <div className="claim-preview__actions--header">
          <span className="media__uri">
            {__('Most supported')}
            <HelpLink href="https://lbry.com/faq/tipping" />
          </span>
        </div>
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
        {!hideLink && (
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
