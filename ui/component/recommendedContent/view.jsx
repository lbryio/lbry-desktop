// @flow
import { SHOW_ADS } from 'config';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import ClaimList from 'component/claimList';
import ClaimListDiscover from 'component/claimListDiscover';
import Ads from 'web/component/ads';
import Card from 'component/common/card';
import { useIsMobile, useIsMediumScreen } from 'effects/use-screensize';
import Button from 'component/button';
import classnames from 'classnames';
import { CONTAINER_ID } from 'constants/navigation';

const VIEW_ALL_RELATED = 'view_all_related';
const VIEW_MORE_FROM = 'view_more_from';

type Props = {
  uri: string,
  recommendedContent: Array<string>,
  nextRecommendedUri: string,
  isSearching: boolean,
  doFetchRecommendedContent: (string, boolean) => void,
  mature: boolean,
  isAuthenticated: boolean,
  claim: ?StreamClaim,
  doRecommendationUpdate: (claimId: string, urls: Array<string>, id: string, parentId: string) => void,
  doRecommendationClicked: (claimId: string, index: number) => void,
};

export default React.memo<Props>(function RecommendedContent(props: Props) {
  const {
    uri,
    doFetchRecommendedContent,
    mature,
    recommendedContent,
    nextRecommendedUri,
    isSearching,
    isAuthenticated,
    claim,
    doRecommendationUpdate,
    doRecommendationClicked,
  } = props;
  const [viewMode, setViewMode] = React.useState(VIEW_ALL_RELATED);
  const [recommendationId, setRecommendationId] = React.useState('');
  const [recommendationUrls, setRecommendationUrls] = React.useState();
  const history = useHistory();
  const signingChannel = claim && claim.signing_channel;
  const channelName = signingChannel ? signingChannel.name : null;
  const isMobile = useIsMobile();
  const isMedium = useIsMediumScreen();

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

    const newRecommendationUrls = moveAutoplayNextItemToTop(recommendedContent);

    if (claim && !listEq(recommendationUrls, newRecommendationUrls)) {
      const parentId = (history.location.state && history.location.state[CONTAINER_ID]) || '';
      const id = uuidv4();
      setRecommendationId(id);
      setRecommendationUrls(newRecommendationUrls);

      doRecommendationUpdate(claim.claim_id, newRecommendationUrls, id, parentId);
    }
  }, [
    recommendedContent,
    nextRecommendedUri,
    recommendationUrls,
    setRecommendationUrls,
    claim,
    doRecommendationUpdate,
    history.location.state,
  ]);

  React.useEffect(() => {
    doFetchRecommendedContent(uri, mature);
  }, [uri, mature, doFetchRecommendedContent]);

  function handleRecommendationClicked(e: any, index: number) {
    if (claim) {
      doRecommendationClicked(claim.claim_id, index);
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
              id={recommendationId}
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
    (a.recommendedContent && !b.recommendedContent) ||
    (!a.recommendedContent && b.recommendedContent) ||
    (a.claim && !b.claim) ||
    (!a.claim && b.claim)
  ) {
    return false;
  }

  if (a.claim && b.claim && a.claim.claim_id !== b.claim.claim_id) {
    return false;
  }

  if (a.recommendedContent && b.recommendedContent) {
    if (a.recommendedContent.length !== b.recommendedContent.length) {
      return false;
    }

    let i = a.recommendedContent.length;
    while (i--) {
      if (a.recommendedContent[i] !== b.recommendedContent[i]) {
        return false;
      }
    }
  }

  return true;
}
