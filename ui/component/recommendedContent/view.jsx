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
};

export default function RecommendedContent(props: Props) {
  const {
    uri,
    doFetchRecommendedContent,
    mature,
    recommendedContent,
    nextRecommendedUri,
    isSearching,
    isAuthenticated,
    claim,
  } = props;
  const [viewMode, setViewMode] = React.useState(VIEW_ALL_RELATED);
  const signingChannel = claim && claim.signing_channel;
  const channelName = signingChannel ? signingChannel.name : null;
  const isMobile = useIsMobile();
  const isMedium = useIsMediumScreen();

  function reorderList(recommendedContent) {
    let newList = recommendedContent;
    if (newList) {
      const index = newList.indexOf(nextRecommendedUri);
      if (index === -1) {
        // This would be weird. Shouldn't happen since it is derived from the same list.
      } else if (index !== 0) {
        // Swap the "next" item to the top of the list
        const a = newList[0];
        newList[0] = nextRecommendedUri;
        newList[index] = a;
      }
    }
    return newList;
  }

  React.useEffect(() => {
    doFetchRecommendedContent(uri, mature);
  }, [uri, mature, doFetchRecommendedContent]);

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
              uris={reorderList(recommendedContent)}
              hideMenu={isMobile}
              injectedItem={SHOW_ADS && IS_WEB && !isAuthenticated && <Ads small type={'video'} />}
              empty={__('No related content found')}
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
}
