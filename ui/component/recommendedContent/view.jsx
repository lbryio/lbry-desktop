// @flow
import { SHOW_ADS, SIMPLE_SITE } from 'config';
import React from 'react';
import ClaimList from 'component/claimList';
import Ads from 'web/component/ads';
import Card from 'component/common/card';
import { useIsMobile, useIsMediumScreen } from 'effects/use-screensize';

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
      body={
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
      }
    />
  );
}
