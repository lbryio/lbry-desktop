// @flow
import { SHOW_ADS, SIMPLE_SITE } from 'config';
import React from 'react';
import ClaimList from 'component/claimList';
import ClaimListDiscover from 'component/claimListDiscover';
import Ads from 'web/component/ads';
import Card from 'component/common/card';
import { useIsMobile, useIsMediumScreen } from 'effects/use-screensize';
import Button from 'component/button';

type Props = {
  uri: string,
  recommendedContent: Array<string>,
  nextRecommendedUri: string,
  isSearching: boolean,
  doFetchRecommendedContent: (string, boolean) => void,
  mature: boolean,
  isAuthenticated: boolean,
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
  } = props;
  const [expanded, setExpanded] = React.useState(false);
  const [allRelated, setAllRelated] = React.useState(true);
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
      subtitle={
        <div
          className={classnames({
            'related_content-more--contracted': !expanded,
            'related_content-more--expanded': expanded,
          })}
        >
          <Button
            button="alt"
            label={__('All')}
            onClick={() => {
              setAllRelated(true);
              setMoreFrom(false);
              setTagList(false);
            }}
          />
          {channelName && (
            <Button
              button="alt"
              label={__('More from %claim_name%', { claim_name: channelName })}
              onClick={() => {
                setAllRelated(false);
                setMoreFrom(true);
                setTagList(false);
              }}
            />
          )}
        </div>
      }
      body={
        <div>
          {allRelated && (
            <ClaimList
              type="small"
              loading={isSearching}
              uris={reorderList(recommendedContent)}
              hideMenu={isMobile}
              injectedItem={
                SHOW_ADS && IS_WEB ? (
                  SIMPLE_SITE ? (
                    <Ads small type={'google'} uri={uri} />
                  ) : (
                    !isAuthenticated && <Ads small type={'video'} />
                  )
                ) : (
                  false
                )
              }
              empty={__('No related content found')}
            />
          )}
          {moreFrom && (
            <ClaimListDiscover
              hideAdvancedFilter={true}
              tileLayout={false}
              showHeader={false}
              type="small"
              claimType={['stream']}
              orderBy="new"
              pageSize={20}
              infiniteScroll={false}
              hideFilters={true}
              channelIds={[signingChannel.claim_id]}
              loading={isSearching}
              hideMenu={isMobile}
              injectedItem={
                SHOW_ADS && IS_WEB ? (
                  SIMPLE_SITE ? (
                    <Ads small type={'google'} uri={uri} />
                  ) : (
                    !isAuthenticated && <Ads small type={'video'} />
                  )
                ) : (
                  false
                )
              }
              empty={__('No related content found')}
            />
          )}
        </div>
      }
    />
  );
}
