// @flow
import { v4 as Uuidv4 } from 'uuid';
import { SHOW_ADS, AD_KEYWORD_BLOCKLIST, AD_KEYWORD_BLOCKLIST_CHECK_DESCRIPTION } from 'config';
import React from 'react';
import ClaimList from 'component/claimList';
import ClaimListDiscover from 'component/claimListDiscover';
import Spinner from 'component/spinner';
import Ads from 'web/component/ads';
import Card from 'component/common/card';
import { useIsMobile, useIsMediumScreen } from 'effects/use-screensize';
import Button from 'component/button';
import { FYP_ID } from 'constants/urlParams';
import classnames from 'classnames';
import RecSys from 'recsys';
import { getClaimMetadata } from 'util/claim';

const VIEW_ALL_RELATED = 'view_all_related';
const VIEW_MORE_FROM = 'view_more_from';
const BLOCKED_WORDS: ?Array<string> = AD_KEYWORD_BLOCKLIST && AD_KEYWORD_BLOCKLIST.toLowerCase().split(',');
const CHECK_DESCRIPTION: boolean = AD_KEYWORD_BLOCKLIST_CHECK_DESCRIPTION === 'true';

type Props = {
  uri: string,
  recommendedContentUris: Array<string>,
  nextRecommendedUri: string,
  isSearching: boolean,
  doFetchRecommendedContent: (string, ?FypParam) => void,
  claim: ?StreamClaim,
  claimId: string,
  metadata: any,
  location: UrlLocation,
  hasPremiumPlus: boolean,
};

export default React.memo<Props>(function RecommendedContent(props: Props) {
  const {
    uri,
    doFetchRecommendedContent,
    recommendedContentUris,
    nextRecommendedUri,
    isSearching,
    claim,
    location,
    hasPremiumPlus,
  } = props;

  const claimId: ?string = claim && claim.claim_id;
  const injectAds = SHOW_ADS && IS_WEB && !hasPremiumPlus;

  function claimContainsBlockedWords(claim: ?StreamClaim) {
    if (BLOCKED_WORDS) {
      const hasBlockedWords = (str) => BLOCKED_WORDS.some((bw) => str.includes(bw));
      const metadata = getClaimMetadata(claim);
      // $FlowFixMe - flow does not support chaining yet, but we know for sure these fields are '?string'.
      const title = metadata?.title?.toLowerCase();
      // $FlowFixMe
      const description = metadata?.description?.toLowerCase();
      // $FlowFixMe
      const name = claim?.name?.toLowerCase();

      return Boolean(
        (title && hasBlockedWords(title)) ||
          (name && hasBlockedWords(name)) ||
          (CHECK_DESCRIPTION && description && hasBlockedWords(description))
      );
    }
    return false;
  }

  const blacklistTriggered = React.useMemo(() => injectAds && claimContainsBlockedWords(claim), [injectAds, claim]);

  const [viewMode, setViewMode] = React.useState(VIEW_ALL_RELATED);
  const signingChannel = claim && claim.signing_channel;
  const channelName = signingChannel ? signingChannel.name : null;
  const isMobile = useIsMobile();
  const isMedium = useIsMediumScreen();
  const { onRecsLoaded: onRecommendationsLoaded, onClickedRecommended: onRecommendationClicked } = RecSys;

  const InjectedAd =
    injectAds && !blacklistTriggered && !hasPremiumPlus
      ? {
          node: <Ads small type="video" filePage className="ads__claim-item--recommended" noFallback />,
          index: isMobile ? 0 : 3,
        }
      : null;

  // Assume this component always resides in a page where the `uri` matches
  // e.g. never in a floating popup. With that, we can grab the FYP ID from
  // the search param directly. Otherwise, the parent component would need to
  // pass it.
  // @see https://www.notion.so/FYP-Design-Notes-727782dde2cb485290c530ae96a34285
  const { search } = location;
  const urlParams = new URLSearchParams(search);
  const fypId = urlParams.get(FYP_ID);
  const [uuid] = React.useState(fypId ? Uuidv4() : '');

  React.useEffect(() => {
    const fypParam = fypId && uuid ? { gid: fypId, uuid } : null;
    doFetchRecommendedContent(uri, fypParam);
  }, [uri, doFetchRecommendedContent, fypId, uuid]);

  React.useEffect(() => {
    // Right now we only want to record the recs if they actually saw them.
    if (
      claimId &&
      recommendedContentUris &&
      recommendedContentUris.length &&
      nextRecommendedUri &&
      viewMode === VIEW_ALL_RELATED
    ) {
      onRecommendationsLoaded(claimId, recommendedContentUris, uuid);
    }
  }, [recommendedContentUris, onRecommendationsLoaded, claimId, nextRecommendedUri, viewMode, uuid]);

  function handleRecommendationClicked(e, clickedClaim) {
    if (claim) {
      onRecommendationClicked(claim.claim_id, clickedClaim.claim_id);
    }
  }

  return (
    <Card
      isBodyList
      smallTitle={!isMobile && !isMedium}
      className="file-page__recommended"
      title={__('Related')}
      titleActions={
        signingChannel && (
          <div className="recommended-content__bubble">
            <Button
              className={classnames('button-bubble', {
                'button-bubble--active': viewMode === VIEW_ALL_RELATED,
              })}
              label={__('Related')}
              onClick={() => setViewMode(VIEW_ALL_RELATED)}
            />

            <Button
              className={classnames('button-bubble', {
                'button-bubble--active': viewMode === VIEW_MORE_FROM,
              })}
              label={__('More from %claim_name%', { claim_name: channelName })}
              onClick={() => setViewMode(VIEW_MORE_FROM)}
            />
          </div>
        )
      }
      body={
        <div>
          {isSearching && (
            <div className="empty empty--centered-tight">
              <Spinner type="small" />
            </div>
          )}
          {viewMode === VIEW_ALL_RELATED && (
            <ClaimList
              type="small"
              loading={isSearching}
              uris={recommendedContentUris}
              hideMenu={isMobile}
              injectedItem={InjectedAd}
              empty={__('No related content found')}
              onClick={handleRecommendationClicked}
            />
          )}
          {viewMode === VIEW_MORE_FROM && signingChannel && (
            <ClaimListDiscover
              hideAdvancedFilter
              tileLayout={false}
              showHeader={false}
              type="small"
              claimType={['stream']}
              orderBy="new"
              pageSize={20}
              infiniteScroll={false}
              hideFilters
              channelIds={[signingChannel.claim_id]}
              loading={isSearching}
              hideMenu={isMobile}
              injectedItem={InjectedAd}
              empty={__('No related content found')}
            />
          )}
        </div>
      }
    />
  );
}, areEqual);

function areEqual(prevProps: Props, nextProps: Props) {
  const a = prevProps;
  const b = nextProps;

  if (
    a.uri !== b.uri ||
    a.nextRecommendedUri !== b.nextRecommendedUri ||
    a.isSearching !== b.isSearching ||
    (a.recommendedContentUris && !b.recommendedContentUris) ||
    (!a.recommendedContentUris && b.recommendedContentUris) ||
    (a.claim && !b.claim) ||
    (!a.claim && b.claim)
  ) {
    return false;
  }

  if (a.claim && b.claim && a.claim.claim_id !== b.claim.claim_id) {
    return false;
  }

  if (a.recommendedContentUris && b.recommendedContentUris) {
    if (a.recommendedContentUris.length !== b.recommendedContentUris.length) {
      return false;
    }

    let i = a.recommendedContentUris.length;
    while (i--) {
      if (a.recommendedContentUris[i] !== b.recommendedContentUris[i]) {
        return false;
      }
    }
  }

  return true;
}
