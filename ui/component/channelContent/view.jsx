// @flow
import { SHOW_ADS } from 'config';
import { LIVE_STREAM_CHANNEL_CLAIM_ID } from 'constants/livestream';
import * as CS from 'constants/claim_search';
import * as ICONS from 'constants/icons';
import React, { Fragment } from 'react';
import HiddenNsfwClaims from 'component/hiddenNsfwClaims';
import { useHistory } from 'react-router-dom';
import Button from 'component/button';
import ClaimListDiscover from 'component/claimListDiscover';
import Ads from 'web/component/ads';
import Icon from 'component/common/icon';
import { Form, FormField } from 'component/common/form';
import { DEBOUNCE_WAIT_DURATION_MS } from 'constants/search';
import { lighthouse } from 'redux/actions/search';
import LivestreamLink from 'component/livestreamLink';

type Props = {
  uri: string,
  totalPages: number,
  fetching: boolean,
  params: { page: number },
  pageOfClaimsInChannel: Array<StreamClaim>,
  channelIsBlocked: boolean,
  channelIsMine: boolean,
  fetchClaims: (string, number) => void,
  channelIsBlackListed: boolean,
  defaultPageSize?: number,
  defaultInfiniteScroll?: Boolean,
  claim: ?Claim,
  isAuthenticated: boolean,
  showMature: boolean,
  tileLayout: boolean,
};

function ChannelContent(props: Props) {
  const {
    uri,
    fetching,
    channelIsMine,
    channelIsBlocked,
    channelIsBlackListed,
    claim,
    isAuthenticated,
    defaultPageSize = CS.PAGE_SIZE,
    defaultInfiniteScroll = true,
    showMature,
    tileLayout,
  } = props;
  const claimsInChannel = (claim && claim.meta.claims_in_channel) || 0;
  const [searchQuery, setSearchQuery] = React.useState('');
  const [searchResults, setSearchResults] = React.useState(undefined);
  const {
    location: { pathname, search },
  } = useHistory();
  const url = `${pathname}${search}`;
  const claimId = claim && claim.claim_id;

  function handleInputChange(e) {
    const { value } = e.target;
    setSearchQuery(value);
  }

  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery === '' || !claimId) {
        // In order to display original search results, search results must be set to null. A query of '' should display original results.
        return setSearchResults(null);
      } else {
        lighthouse
          .search(
            `s=${encodeURIComponent(searchQuery)}&channel_id=${encodeURIComponent(claimId)}${
              !showMature ? '&nsfw=false&size=25&from=0' : ''
            }`
          )
          .then(results => {
            const urls = results.map(({ name, claimId }) => {
              return `lbry://${name}#${claimId}`;
            });

            setSearchResults(urls);
          })
          .catch(() => {
            setSearchResults(null);
          });
      }
    }, DEBOUNCE_WAIT_DURATION_MS);
    return () => clearTimeout(timer);
  }, [claimId, searchQuery, showMature]);

  React.useEffect(() => {
    setSearchQuery('');
    setSearchResults(null);
  }, [url]);

  return (
    <Fragment>
      {claimId === LIVE_STREAM_CHANNEL_CLAIM_ID && <LivestreamLink />}

      {!fetching && Boolean(claimsInChannel) && !channelIsBlocked && !channelIsBlackListed && (
        <HiddenNsfwClaims uri={uri} />
      )}

      {!fetching && channelIsBlackListed && (
        <section className="card card--section">
          <p>
            {__(
              'In response to a complaint we received under the US Digital Millennium Copyright Act, we have blocked access to this channel from our applications.'
            )}
          </p>
          <div className="section__actions">
            <Button button="link" href="https://lbry.com/faq/dmca" label={__('Read More')} />
          </div>
        </section>
      )}

      {!fetching && channelIsBlocked && (
        <div className="card--section">
          <h2 className="help">{__('You have blocked this channel content.')}</h2>
        </div>
      )}

      {!channelIsMine && claimsInChannel > 0 && <HiddenNsfwClaims uri={uri} />}

      {claim && claimsInChannel > 0 ? (
        <ClaimListDiscover
          forceShowReposts
          tileLayout={tileLayout}
          uris={searchResults}
          channelIds={[claim.claim_id]}
          claimType={CS.CLAIM_TYPES}
          feeAmount={CS.FEE_AMOUNT_ANY}
          defaultOrderBy={CS.ORDER_BY_NEW}
          pageSize={defaultPageSize}
          streamType={CS.CONTENT_ALL}
          infiniteScroll={defaultInfiniteScroll}
          injectedItem={SHOW_ADS && !isAuthenticated && IS_WEB && <Ads type="video" />}
          meta={
            <Form onSubmit={() => {}} className="wunderbar--inline">
              <Icon icon={ICONS.SEARCH} />
              <FormField
                className="wunderbar__input--inline"
                value={searchQuery}
                onChange={handleInputChange}
                type="text"
                placeholder={__('Search')}
              />
            </Form>
          }
        />
      ) : (
        <section className="main--empty">{__("This channel hasn't published anything yet")}</section>
      )}
    </Fragment>
  );
}

export default ChannelContent;
