// @flow
import { SHOW_ADS, SIMPLE_SITE } from 'config';
import * as CS from 'constants/claim_search';
import * as ICONS from 'constants/icons';
import React, { Fragment } from 'react';
import HiddenNsfwClaims from 'component/hiddenNsfwClaims';
import { useHistory } from 'react-router-dom';
import Button from 'component/button';
import ClaimListDiscover from 'component/claimListDiscover';
import ClaimListSearch from 'component/claimListSearch';
import Ads from 'web/component/ads';
import Icon from 'component/common/icon';
import LivestreamLink from 'component/livestreamLink';
import { Form, FormField } from 'component/common/form';
import { DEBOUNCE_WAIT_DURATION_MS } from 'constants/search';
import ScheduledStreams from 'component/scheduledStreams';
import { useIsLargeScreen } from 'effects/use-screensize';

const TYPES_TO_ALLOW_FILTER = ['stream', 'repost'];

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
  claim: Claim,
  isAuthenticated: boolean,
  showMature: boolean,
  tileLayout: boolean,
  viewHiddenChannels: boolean,
  claimType: string,
  empty?: string,
  doFetchChannelLiveStatus: (string) => void,
  activeLivestreamForChannel: any,
  activeLivestreamInitialized: boolean,
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
    claimType,
    empty,
    doFetchChannelLiveStatus,
    activeLivestreamForChannel,
    activeLivestreamInitialized,
  } = props;
  // const claimsInChannel = (claim && claim.meta.claims_in_channel) || 0;
  const claimsInChannel = 9999;
  const [searchQuery, setSearchQuery] = React.useState('');
  const [isSearch, setIsSearch] = React.useState(false);
  const isLargeScreen = useIsLargeScreen();
  const {
    location: { pathname, search },
  } = useHistory();
  const url = `${pathname}${search}`;
  const claimId = claim && claim.claim_id;
  const isChannelEmpty = !claim || !claim.meta;
  const showFilters =
    !claimType ||
    (Array.isArray(claimType)
      ? claimType.every((ct) => TYPES_TO_ALLOW_FILTER.includes(ct))
      : TYPES_TO_ALLOW_FILTER.includes(claimType));
  const dynamicPageSize = isLargeScreen ? Math.ceil(defaultPageSize * (3 / 2)) : defaultPageSize;

  function handleInputChange(e) {
    const { value } = e.target;
    setSearchQuery(value);
  }

  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim().length < 3 || !claimId) {
        setIsSearch(false);
      } else {
        setIsSearch(true);
      }
    }, DEBOUNCE_WAIT_DURATION_MS);
    return () => clearTimeout(timer);
  }, [claimId, searchQuery]);

  React.useEffect(() => {
    setSearchQuery('');
    setIsSearch(false);
  }, [url]);

  const isInitialized = Boolean(activeLivestreamForChannel) || activeLivestreamInitialized;
  const isChannelBroadcasting = Boolean(activeLivestreamForChannel);

  // Find out current channels status + active live claim.
  React.useEffect(() => {
    doFetchChannelLiveStatus(claimId);
    const intervalId = setInterval(() => doFetchChannelLiveStatus(claimId), 30000);
    return () => clearInterval(intervalId);
  }, [claimId, doFetchChannelLiveStatus]);

  const showScheduledLiveStreams = claimType !== 'collection'; // ie. not on the playlist page.

  return (
    <Fragment>
      {!fetching && Boolean(claimsInChannel) && !channelIsBlocked && !channelIsBlackListed && (
        <HiddenNsfwClaims uri={uri} />
      )}

      {!fetching && isInitialized && isChannelBroadcasting && !isChannelEmpty && (
        <LivestreamLink claimUri={activeLivestreamForChannel.claimUri} />
      )}

      {!fetching && showScheduledLiveStreams && (
        <ScheduledStreams
          channelIds={[claimId]}
          tileLayout={tileLayout}
          liveUris={
            isChannelBroadcasting && activeLivestreamForChannel.claimUri ? [activeLivestreamForChannel.claimUri] : []
          }
          showHideSetting={false}
        />
      )}

      {!fetching && channelIsBlackListed && (
        <section className="card card--section">
          <p>
            {__(
              'In response to a complaint we received under the US Digital Millennium Copyright Act, we have blocked access to this channel from our applications. Content may also be blocked due to DMCA Red Flag rules which are obvious copyright violations we come across, are discussed in public channels, or reported to us.'
            )}
          </p>
          <div className="section__actions">
            <Button button="link" href="https://odysee.com/@OdyseeHelp:b/copyright:f" label={__('Read More')} />
          </div>
        </section>
      )}

      {!fetching && channelIsBlocked && (
        <div className="card--section">
          <h2 className="help">{__('You have blocked this channel content.')}</h2>
        </div>
      )}

      {!channelIsMine && claimsInChannel > 0 && <HiddenNsfwClaims uri={uri} />}

      {/* <Ads type="homepage" /> */}

      {!fetching &&
        (isSearch ? (
          <ClaimListSearch
            defaultFreshness={CS.FRESH_ALL}
            showHiddenByUser={viewHiddenChannels}
            fetchViewCount
            hideFilters={!showFilters}
            hideAdvancedFilter={!showFilters}
            tileLayout={tileLayout}
            streamType={SIMPLE_SITE ? CS.CONTENT_ALL : undefined}
            channelIds={[claimId]}
            claimId={claimId}
            claimType={claimType}
            feeAmount={CS.FEE_AMOUNT_ANY}
            defaultOrderBy={CS.ORDER_BY_NEW}
            pageSize={dynamicPageSize}
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
            channelIsMine={channelIsMine}
            empty={empty}
            showMature={showMature}
            searchKeyword={searchQuery}
          />
        ) : (
          <ClaimListDiscover
            hasSource
            defaultFreshness={CS.FRESH_ALL}
            showHiddenByUser={viewHiddenChannels}
            forceShowReposts
            fetchViewCount
            hideFilters={!showFilters}
            hideAdvancedFilter={!showFilters}
            tileLayout={tileLayout}
            streamType={SIMPLE_SITE ? CS.CONTENT_ALL : undefined}
            channelIds={[claimId]}
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
            empty={empty}
          />
        ))}
    </Fragment>
  );
}

export default ChannelContent;
