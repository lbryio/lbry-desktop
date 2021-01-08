// @flow
import { SHOW_ADS } from 'config';
import React from 'react';
import ClaimList from 'component/claimList';
import Ads from 'web/component/ads';
import Card from 'component/common/card';
import { useIsMobile, useIsMediumScreen } from 'effects/use-screensize';

type Options = {
  related_to: string,
  nsfw?: boolean,
};

type Props = {
  uri: string,
  claim: ?StreamClaim,
  recommendedContent: Array<string>,
  isSearching: boolean,
  search: (string, Options) => void,
  mature: boolean,
  isAuthenticated: boolean,
};

export default function RecommendedContent(props: Props) {
  const { uri, claim, search, mature, recommendedContent, isSearching, isAuthenticated } = props;
  const isMobile = useIsMobile();
  const isMedium = useIsMediumScreen();

  const stringifiedClaim = JSON.stringify(claim);
  const getRecommendedContent = React.useCallback(() => {
    if (stringifiedClaim) {
      const jsonClaim = JSON.parse(stringifiedClaim);
      if (jsonClaim && jsonClaim.value && jsonClaim.claim_id) {
        const options: Options = { size: 20, related_to: jsonClaim.claim_id, isBackgroundSearch: true };
        if (jsonClaim && !mature) {
          options['nsfw'] = false;
        }
        const { title } = jsonClaim.value;
        if (title && options) {
          search(title, options);
        }
      }
    }
  }, [stringifiedClaim, mature]);

  React.useEffect(() => {
    getRecommendedContent();
  }, [uri]);

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
          uris={recommendedContent}
          injectedItem={SHOW_ADS && !isAuthenticated && IS_WEB && <Ads type="video" small />}
          empty={__('No related content found')}
        />
      }
    />
  );
}
