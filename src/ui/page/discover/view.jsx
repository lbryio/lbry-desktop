// @flow
import React from 'react';
import Page from 'component/page';
import CategoryList from 'component/categoryList';
import FirstRun from 'component/firstRun';

type Props = {
  fetchFeaturedUris: () => void,
  fetchRewardedContent: () => void,
  fetchRewards: () => void,
  fetchingFeaturedUris: boolean,
  featuredUris: {},
};

class DiscoverPage extends React.PureComponent<Props> {
  constructor() {
    super();
    this.continousFetch = undefined;
  }

  componentDidMount() {
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
      <Page notContained isLoading={!hasContent && fetchingFeaturedUris} className="main--no-padding">
        <FirstRun />
        {hasContent &&
          Object.keys(featuredUris).map(category => (
            <CategoryList
              lazyLoad
              key={category}
              category={this.trimClaimIdFromCategory(category)}
              uris={featuredUris[category]}
              categoryLink={this.getCategoryLinkPartByCategory(category)}
            />
          ))}
        {failedToLoad && <div className="empty">{__('Failed to load landing content.')}</div>}
      </Page>
    );
  }
}

export default DiscoverPage;
