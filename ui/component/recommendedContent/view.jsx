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
import { FormField } from '../common/form-components/form-field';
import I18nMessage from '../i18nMessage';
import CreditAmount from '../common/credit-amount';

const VIEW_ALL_RELATED = 'view_all_related';
const VIEW_MORE_FROM = 'view_more_from';

type Props = {
  uri: string,
  recommendedContentUris: Array<string>,
  nextRecommendedUri: string,
  isSearching: boolean,
  doFetchRecommendedContent: (string) => void,
  isAuthenticated: boolean,
  claim: ?StreamClaim,
  claimId: string,
};

export default React.memo<Props>(function RecommendedContent(props: Props) {
  const {
    uri,
    doFetchRecommendedContent,
    recommendedContentUris,
    nextRecommendedUri,
    isSearching,
    isAuthenticated,
    claim,
    claimId,
  } = props;
  const [viewMode, setViewMode] = React.useState(VIEW_ALL_RELATED);
  const [strict, setStrict] = React.useState(false);
  const [wordCount, setWordCount] = React.useState(3);
  const signingChannel = claim && claim.signing_channel;
  const channelName = signingChannel ? signingChannel.name : null;
  const isMobile = useIsMobile();
  const isMedium = useIsMediumScreen();
  const { onRecsLoaded: onRecommendationsLoaded, onClickedRecommended: onRecommendationClicked } = RecSys;

  React.useEffect(() => {
    doFetchRecommendedContent(uri);
  }, [uri, doFetchRecommendedContent]);

  React.useEffect(() => {
    // Right now we only want to record the recs if they actually saw them.
    if (
      recommendedContentUris &&
      recommendedContentUris.length &&
      nextRecommendedUri &&
      viewMode === VIEW_ALL_RELATED
    ) {
      onRecommendationsLoaded(claimId, recommendedContentUris);
    }
  }, [recommendedContentUris, onRecommendationsLoaded, claimId, nextRecommendedUri, viewMode]);

  function handleRecommendationClicked(e, clickedClaim) {
    if (claim) {
      onRecommendationClicked(claim.claim_id, clickedClaim.claim_id);
    }
  }

  function getSearchTextForClaim(claim) {
    const wordMap = {};

    const addToWordmap = (word) => {
      if (wordMap[word]) {
        wordMap[word]++;
      } else {
        wordMap[word] = 1;
      }
    };

    claim.name.split('-').map((word) => addToWordmap(word));
    if (claim.value.title) {
      claim.value.title.split(' ').map((word) => addToWordmap(word));
    }
    if (claim.value.tags) {
      claim.value.tags.forEach((tag) => tag.split(' ').map((word) => addToWordmap(word)));
    }
    if (claim.value.description) {
      claim.value.description.split(' ').map((word) => addToWordmap(word));
    }
    console.log('wordMap', wordMap);

    const sorted = Object.entries(wordMap)
      .sort(([, a], [, b]) => b - a)
      .map(([el, val]) => el)
      .filter((e) => e.length >= 4);
    let searchText = sorted.slice(0, wordCount).join(strict ? ' +' : ' ');
    console.log('searchText', searchText);
    // console.log('claim.title');
    // if (claim.value && claim.value.title) {
    //   searchText += claim.value.title;
    // }
    // if (claim.value.description) {
    //   searchText += claim.value.description;
    // }
    console.log('searchText', searchText);
    return searchText;
  }

  const searchText = claim ? getSearchTextForClaim(claim) : undefined;

  return (
    <Card
      isBodyList
      smallTitle={!isMobile && !isMedium}
      className="file-page__recommended"
      // title={__('Related')}
      // titleActions={
      //   signingChannel && (
      //     <>
      //
      //     <div className="recommended-content__toggles">
      //
      //       <Button
      //         className={classnames('button-toggle', {
      //           'button-toggle--active': viewMode === VIEW_ALL_RELATED,
      //         })}
      //         label={__('All')}
      //         onClick={() => setViewMode(VIEW_ALL_RELATED)}
      //       />
      //
      //       <Button
      //         className={classnames('button-toggle', {
      //           'button-toggle--active': viewMode === VIEW_MORE_FROM,
      //         })}
      //         label={__('More from %claim_name%', { claim_name: channelName })}
      //         onClick={() => setViewMode(VIEW_MORE_FROM)}
      //       />
      //     </div>
      //       </>
      //   )
      // }
      subtitle={
        <div className="card__whatever">
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
          <div className="section section__actions--between">
            <FormField
              name="word_count"
              label={__('Word Count')}
              min="0"
              step="1"
              type="number"
              value={wordCount}
              onChange={(event) => setWordCount(event.target.value)}
            />
            <FormField
              name="search_strict"
              label={__('Strict')}
              type="checkbox"
              checked={strict}
              onChange={() => setStrict(!strict)}
            />
          </div>
          <p>{searchText}</p>
        </div>
      }
      body={
        <div>
          {viewMode === VIEW_ALL_RELATED && IS_WEB && (
            <ClaimList
              type="small"
              loading={isSearching}
              uris={recommendedContentUris}
              hideMenu={isMobile}
              infiniteScroll
              injectedItem={SHOW_ADS && IS_WEB && !isAuthenticated && <Ads small type={'video'} />}
              empty={__('No related content found')}
              onClick={handleRecommendationClicked}
            />
          )}
          {/*{viewMode === VIEW_ALL_RELATED && !IS_WEB && (*/}
          {/*  <ClaimList*/}
          {/*    type="small"*/}
          {/*    loading={isSearching}*/}
          {/*    uris={recommendedContentUris}*/}
          {/*    hideMenu={isMobile}*/}
          {/*    infiniteScroll*/}
          {/*    injectedItem={SHOW_ADS && IS_WEB && !isAuthenticated && <Ads small type={'video'} />}*/}
          {/*    empty={__('No related content found')}*/}
          {/*    onClick={handleRecommendationClicked}*/}
          {/*  />*/}
          {/*)}*/}
          {viewMode === VIEW_ALL_RELATED && !IS_WEB && (
            <ClaimListDiscover
              hideAdvancedFilter
              tileLayout={false}
              showHeader={false}
              type="small"
              claimType={['stream']}
              // orderBy={['trending_group', 'trending_mixed']}
              orderBy={'new'}
              pageSize={20}
              infiniteScroll
              hideFilters
              searchText={searchText}
              // channelIds={[signingChannel.claim_id]}
              loading={isSearching}
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
              infiniteScroll={true}
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
