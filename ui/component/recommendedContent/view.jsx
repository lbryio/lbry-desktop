// @flow
import { SHOW_ADS } from 'config';
import React from 'react';
import ClaimList from 'component/claimList';
import ClaimListDiscover from 'component/claimListDiscover';
import Ads from 'web/component/ads';
import Card from 'component/common/card';
import { useIsMobile, useIsMediumScreen } from 'effects/use-screensize';
import Button from 'component/button';
import classnames from 'classnames';
import RecSys from 'recsys';

const VIEW_ALL_RELATED = 'view_all_related';
const VIEW_MORE_FROM = 'view_more_from';

type Props = {
  uri: string,
  recommendedContentUris: Array<string>,
  nextRecommendedUri: string,
  isSearching: boolean,
  doFetchRecommendedContent: (string, boolean) => void,
  mature: boolean,
  isAuthenticated: boolean,
  claim: ?StreamClaim,
  doRecommendationUpdate: (claimId: string, urls: Array<string>, id: string, parentId: string) => void,
  claimId: string,
};

export default React.memo<Props>(function RecommendedContent(props: Props) {
  const {
    uri,
    doFetchRecommendedContent,
    mature,
    recommendedContentUris,
    nextRecommendedUri,
    isSearching,
    isAuthenticated,
    claim,
    claimId,
  } = props;
  const [viewMode, setViewMode] = React.useState(VIEW_ALL_RELATED);
  const [recommendationUrls, setRecommendationUrls] = React.useState();
  const signingChannel = claim && claim.signing_channel;
  const channelName = signingChannel ? signingChannel.name : null;
  const isMobile = useIsMobile();
  const isMedium = useIsMediumScreen();
  const { onRecsLoaded: onRecommendationsLoaded, onClickedRecommended: onRecommendationClicked } = RecSys;
  React.useEffect(() => {
    function moveAutoplayNextItemToTop(recommendedContent) {
      let newList = recommendedContent;
      if (newList) {
        const index = newList.indexOf(nextRecommendedUri);
        if (index > 0) {
          const a = newList[0];
          newList[0] = nextRecommendedUri;
          newList[index] = a;
        }
      }
      return newList;
    }

    function listEq(prev, next) {
      if (prev && next) {
        return prev.length === next.length && prev.every((value, index) => value === next[index]);
      } else {
        return prev === next;
      }
    }

    const newRecommendationUrls = moveAutoplayNextItemToTop(recommendedContentUris);

    if (claim && !listEq(recommendationUrls, newRecommendationUrls)) {
      setRecommendationUrls(newRecommendationUrls);
    }
  }, [recommendedContentUris, nextRecommendedUri, recommendationUrls, setRecommendationUrls, claim]);

  React.useEffect(() => {
    doFetchRecommendedContent(uri, mature);
  }, [uri, mature, doFetchRecommendedContent]);

  React.useEffect(() => {
    // Right now we only want to record the recs if they actually saw them.
    if (recommendationUrls && recommendationUrls.length && nextRecommendedUri && viewMode === VIEW_ALL_RELATED) {
      onRecommendationsLoaded(claimId, recommendationUrls);
    }
  }, [recommendationUrls, onRecommendationsLoaded, claimId, nextRecommendedUri, viewMode]);

  function handleRecommendationClicked(e, clickedClaim, index: number) {
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
          <div className="recommended-content__toggles">
            <Button
              className={classnames('button-toggle', {
                'button-toggle--active': viewMode === VIEW_ALL_RELATED,
              })}
              label={__('All')}
              onClick={() => setViewMode(VIEW_ALL_RELATED)}
            />

            <Button
              className={classnames('button-toggle', {
                'button-toggle--active': viewMode === VIEW_MORE_FROM,
              })}
              label={__('More from %claim_name%', { claim_name: channelName })}
              onClick={() => setViewMode(VIEW_MORE_FROM)}
            />
          </div>
        )
      }
      body={
        <div>
          {viewMode === VIEW_ALL_RELATED && (
            <ClaimList
              type="small"
              loading={isSearching}
              uris={recommendationUrls}
              hideMenu={isMobile}
              injectedItem={SHOW_ADS && IS_WEB && !isAuthenticated && <Ads small type={'video'} />}
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
              injectedItem={SHOW_ADS && IS_WEB && !isAuthenticated && <Ads small type={'video'} />}
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
    a.isAuthenticated !== b.isAuthenticated ||
    a.isSearching !== b.isSearching ||
    a.mature !== b.mature ||
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
