// @flow
import React from 'react';
import Page from 'component/page';
import CategoryList from 'component/categoryList';

type Props = {
  fetchFeaturedUris: () => void,
  fetchRewardedContent: () => void,
  fetchingFeaturedUris: boolean,
  featuredUris: {},
};

class DiscoverPage extends React.PureComponent<Props> {
  constructor() {
    super();
    this.continousFetch = undefined;
  }

  componentWillMount() {
    const { fetchFeaturedUris, fetchRewardedContent, fetchRewards } = this.props;
    fetchFeaturedUris();
    fetchRewardedContent();

    this.continousFetch = setInterval(() => {
      fetchFeaturedUris();
      fetchRewardedContent();
      fetchRewards();
    }, 1000 * 60 * 60);
  }

  componentWillUnmount() {
    this.clearContinuousFetch();
  }

  getCategoryLinkPartByCategory(category: string) {
    const channelName = category.substr(category.indexOf('@'));
    if (!channelName.includes('#')) {
      return null;
    }
    return channelName;
  }

  trimClaimIdFromCategory(category: string) {
    return category.split('#')[0];
  }

  continousFetch: ?IntervalID;

  clearContinuousFetch() {
    if (this.continousFetch) {
      clearInterval(this.continousFetch);
      this.continousFetch = null;
    }
  }

  render() {
    const { featuredUris, fetchingFeaturedUris } = this.props;
    const hasContent = typeof featuredUris === 'object' && Object.keys(featuredUris).length;
    const failedToLoad = !fetchingFeaturedUris && !hasContent;
    return (
      <Page noPadding isLoading={!hasContent && fetchingFeaturedUris}>
        {hasContent &&
          Object.keys(featuredUris).map(
            category =>
              featuredUris[category].length ? (
                <CategoryList
                  key={category}
                  category={this.trimClaimIdFromCategory(category)}
                  names={featuredUris[category]}
                  categoryLink={this.getCategoryLinkPartByCategory(category)}
                />
              ) : (
                <CategoryList
                  key={category}
                  category={this.trimClaimIdFromCategory(category)}
                  categoryLink={category}
                />
              )
          )}
        {failedToLoad && <div className="empty">{__('Failed to load landing content.')}</div>}
      </Page>
    );
  }
}

export default DiscoverPage;
