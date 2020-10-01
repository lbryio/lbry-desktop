// @flow
import { SHOW_ADS } from 'config';
import { SEARCH_OPTIONS } from 'constants/search';
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

  function getRecommendedContent() {
    if (claim && claim.value && claim.claim_id) {
      const options: Options = {
        size: 20,
        related_to: claim.claim_id,
        isBackgroundSearch: true,
        [SEARCH_OPTIONS.CLAIM_TYPE]: SEARCH_OPTIONS.INCLUDE_FILES,
        [SEARCH_OPTIONS.MEDIA_VIDEO]: true,
      };
      if (claim && !mature) {
        options['nsfw'] = false;
      }
      const { title } = claim.value;
      if (title && options) {
        search(title, options);
      }
    }
  }

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
          isCardBody
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
