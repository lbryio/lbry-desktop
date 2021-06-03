// @flow
import { SHOW_ADS } from 'config';
import * as CS from 'constants/claim_search';
import * as ICONS from 'constants/icons';
import React, { Fragment } from 'react';
import HiddenNsfwClaims from 'component/hiddenNsfwClaims';
import { useHistory } from 'react-router-dom';
import Button from 'component/button';
import ClaimListDiscover from 'component/claimListDiscover';
import Ads from 'web/component/ads';
import Icon from 'component/common/icon';
import LivestreamLink from 'component/livestreamLink';
import { Form, FormField } from 'component/common/form';
import { DEBOUNCE_WAIT_DURATION_MS } from 'constants/search';
import { lighthouse } from 'redux/actions/search';

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
  viewHiddenChannels: boolean,
  doResolveUris: (Array<string>, boolean) => void,
  claimType: string,
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
    viewHiddenChannels,
    doResolveUris,
    claimType,
  } = props;
  const claimsInChannel = (claim && claim.meta.claims_in_channel) || 0;
  const [searchQuery, setSearchQuery] = React.useState('');
  const [searchResults, setSearchResults] = React.useState(undefined);
  const {
    location: { pathname, search },
  } = useHistory();
  const url = `${pathname}${search}`;
  const claimId = claim && claim.claim_id;
  const showFilters = !claimType || claimType === 'stream';

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
              !showMature ? '&nsfw=false&size=50&from=0' : ''
            }`
          )
          .then((results) => {
            const urls = results.map(({ name, claimId }) => {
              return `lbry://${name}#${claimId}`;
            });

            // Batch-resolve the urls before calling 'setSearchResults', as the
            // latter will immediately cause the tiles to resolve, ending up
            // calling doResolveUri one by one before the batched one.
            doResolveUris(urls, true);

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
      {!fetching && Boolean(claimsInChannel) && !channelIsBlocked && !channelIsBlackListed && (
        <HiddenNsfwClaims uri={uri} />
      )}

      <LivestreamLink uri={uri} />

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
          hideLivestreamClaims
          showHiddenByUser={viewHiddenChannels}
          forceShowReposts
          hideFilters={!showFilters}
          hideAdvancedFilter={!showFilters}
          tileLayout={tileLayout}
          uris={searchResults}
          streamType={CS.CONTENT_ALL}
          channelIds={[claim.claim_id]}
          claimType={claimType}
          feeAmount={CS.FEE_AMOUNT_ANY}
          defaultOrderBy={CS.ORDER_BY_NEW}
          pageSize={defaultPageSize}
          infiniteScroll={defaultInfiniteScroll}
          injectedItem={SHOW_ADS && !isAuthenticated && IS_WEB && <Ads type="video" />}
          meta={
            showFilters && (
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
            )
          }
          isChannel
          channelIsMine={channelIsMine}
        />
      ) : (
        <section className="main--empty">{__("This channel hasn't published anything yet")}</section>
      )}
    </Fragment>
  );
}

export default ChannelContent;
