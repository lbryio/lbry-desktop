// @flow
import { SHOW_ADS, SIMPLE_SITE } from 'config';
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
import ScheduledStreams from 'component/scheduledStreams';

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
  doResolveUris: (Array<string>, boolean) => void,
  claimType: string,
  empty?: string,
  doFetchActiveLivestream: (string) => void,
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
    doResolveUris,
    claimType,
    empty,
    doFetchActiveLivestream,
    activeLivestreamForChannel,
    activeLivestreamInitialized,
  } = props;
  // const claimsInChannel = (claim && claim.meta.claims_in_channel) || 0;
  const claimsInChannel = 9999;
  const [searchQuery, setSearchQuery] = React.useState('');
  const [searchResults, setSearchResults] = React.useState(undefined);
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

  function handleInputChange(e) {
    const { value } = e.target;
    setSearchQuery(value);
  }

  // returns true if passed element is fully visible on screen
  // function isScrolledIntoView(el) {
  //   const rect = el.getBoundingClientRect();
  //   const elemTop = rect.top;
  //   const elemBottom = rect.bottom;
  //
  //   // Only completely visible elements return true:
  //   const isVisible = elemTop >= 0 && elemBottom <= window.innerHeight;
  //   return isVisible;
  // }
  //
  // React.useEffect(() => {
  //   if (isAuthenticated || !SHOW_ADS) {
  //     return;
  //   }
  //
  //   const urlParams = new URLSearchParams(window.location.search);
  //   const viewType = urlParams.get('view');
  //
  //   // only insert ad if it's a content view
  //   if (viewType !== 'content') return;
  //
  //   (async function () {
  //     // test if adblock is enabled
  //     let adBlockEnabled = false;
  //     const googleAdUrl = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
  //     try {
  //       await fetch(new Request(googleAdUrl)).catch((_) => {
  //         adBlockEnabled = true;
  //       });
  //     } catch (e) {
  //       adBlockEnabled = true;
  //     } finally {
  //       if (!adBlockEnabled) {
  //         // select the cards on page
  //         let cards = document.getElementsByClassName('card claim-preview--tile');
  //
  //         // eslint-disable-next-line no-inner-declarations
  //         function checkFlag() {
  //           if (cards.length === 0) {
  //             window.setTimeout(checkFlag, 100);
  //           } else {
  //             // find the last fully visible card
  //             let lastCard;
  //
  //             // width of browser window
  //             const windowWidth = window.innerWidth;
  //
  //             // on small screens, grab the second item
  //             if (windowWidth <= 900) {
  //               lastCard = cards[1];
  //             } else {
  //               // otherwise, get the last fully visible card
  //               for (const card of cards) {
  //                 const isFullyVisible = isScrolledIntoView(card);
  //                 if (!isFullyVisible) break;
  //                 lastCard = card;
  //               }
  //             }
  //
  //             // clone the last card
  //             // $FlowFixMe
  //             const clonedCard = lastCard.cloneNode(true);
  //
  //             // insert cloned card
  //             // $FlowFixMe
  //             lastCard.parentNode.insertBefore(clonedCard, lastCard);
  //
  //             // delete last card so that it doesn't mess up formatting
  //             // $FlowFixMe
  //             // lastCard.remove();
  //
  //             // change the appearance of the cloned card
  //             // $FlowFixMe
  //             clonedCard.querySelector('.claim__menu-button').remove();
  //
  //             // $FlowFixMe
  //             clonedCard.querySelector('.truncated-text').innerHTML = __(
  //               'Hate these? Login to Odysee for an ad free experience'
  //             );
  //
  //             // $FlowFixMe
  //             clonedCard.querySelector('.claim-tile__info').remove();
  //
  //             // $FlowFixMe
  //             clonedCard.querySelector('[role="none"]').removeAttribute('href');
  //
  //             // $FlowFixMe
  //             clonedCard.querySelector('.claim-tile__header').firstChild.href = '/$/signin';
  //
  //             // $FlowFixMe
  //             clonedCard.querySelector('.claim-tile__title').firstChild.removeAttribute('aria-label');
  //
  //             // $FlowFixMe
  //             clonedCard.querySelector('.claim-tile__title').firstChild.removeAttribute('title');
  //
  //             // $FlowFixMe
  //             clonedCard.querySelector('.claim-tile__header').firstChild.removeAttribute('aria-label');
  //
  //             // $FlowFixMe
  //             clonedCard
  //               .querySelector('.media__thumb')
  //               .replaceWith(document.getElementsByClassName('homepageAdContainer')[0]);
  //
  //             // show the homepage ad which is not displayed at first
  //             document.getElementsByClassName('homepageAdContainer')[0].style.display = 'block';
  //
  //             // $FlowFixMe
  //             const imageHeight = window.getComputedStyle(lastCard.querySelector('.media__thumb')).height;
  //             // $FlowFixMe
  //             const imageWidth = window.getComputedStyle(lastCard.querySelector('.media__thumb')).width;
  //
  //             const styles = `#av-container, #AVcontent, #aniBox {
  //               height: ${imageHeight} !important;
  //               width: ${imageWidth} !important;
  //             }`;
  //
  //             const styleSheet = document.createElement('style');
  //             styleSheet.type = 'text/css';
  //             styleSheet.id = 'customAniviewStyling';
  //             styleSheet.innerText = styles;
  //             // $FlowFixMe
  //             document.head.appendChild(styleSheet);
  //
  //             window.dispatchEvent(new CustomEvent('scroll'));
  //           }
  //         }
  //         checkFlag();
  //       }
  //     }
  //   })();
  // }, []);

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
          .then(({ body: results }) => {
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
  }, [claimId, searchQuery, showMature, doResolveUris]);

  React.useEffect(() => {
    setSearchQuery('');
    setSearchResults(null);
  }, [url]);

  const isInitialized = Boolean(activeLivestreamForChannel) || activeLivestreamInitialized;
  const isChannelBroadcasting = Boolean(activeLivestreamForChannel);

  // Find out current channels status + active live claim.
  React.useEffect(() => {
    doFetchActiveLivestream(claimId);
    const intervalId = setInterval(() => doFetchActiveLivestream(claimId), 30000);
    return () => clearInterval(intervalId);
  }, [claimId, doFetchActiveLivestream]);

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

      <Ads type="homepage" />

      {!fetching && (
        <ClaimListDiscover
          hasSource
          defaultFreshness={CS.FRESH_ALL}
          showHiddenByUser={viewHiddenChannels}
          forceShowReposts
          fetchViewCount
          hideFilters={!showFilters}
          hideAdvancedFilter={!showFilters}
          tileLayout={tileLayout}
          uris={searchResults}
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
      )}
    </Fragment>
  );
}

export default ChannelContent;
