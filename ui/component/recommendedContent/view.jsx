// @flow
import React from 'react';
import ClaimList from 'component/claimList';
import ClaimListDiscover from 'component/claimListDiscover';
import Card from 'component/common/card';
import { useIsMobile, useIsMediumScreen } from 'effects/use-screensize';
import Button from 'component/button';
import classnames from 'classnames';

const VIEW_ALL_RELATED = 'view_all_related';
const VIEW_MORE_FROM = 'view_more_from';

type Props = {
  uri: string,
  recommendedContentUris: Array<string>,
  nextRecommendedUri: string,
  isSearching: boolean,
  doFetchRecommendedContent: (string) => void,
  claim: ?StreamClaim,
};

export default React.memo<Props>(function RecommendedContent(props: Props) {
  const { uri, doFetchRecommendedContent, recommendedContentUris, isSearching, claim } = props;
  const [viewMode, setViewMode] = React.useState(VIEW_ALL_RELATED);
  const signingChannel = claim && claim.signing_channel;
  const channelName = signingChannel ? signingChannel.name : null;
  const isMobile = useIsMobile();
  const isMedium = useIsMediumScreen();

  React.useEffect(() => {
    doFetchRecommendedContent(uri);
  }, [uri, doFetchRecommendedContent]);

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
          {viewMode === VIEW_ALL_RELATED && (
            <ClaimList
              type="small"
              loading={isSearching}
              uris={recommendedContentUris}
              hideMenu={isMobile}
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
