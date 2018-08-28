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
    const { fetchFeaturedUris, fetchRewardedContent } = this.props;
    fetchFeaturedUris();
    fetchRewardedContent();

    this.continousFetch = setInterval(() => {
      fetchFeaturedUris();
      fetchRewardedContent();
    }, 1000 * 60 * 60);
  }

  componentWillUnmount() {
    this.clearContinuousFetch();
  }

  clearContinuousFetch() {
    if (this.continousFetch) {
      clearInterval(this.continousFetch);
      this.continousFetch = null;
    }
  }

  continousFetch: ?number;

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
                <CategoryList key={category} category={category} names={featuredUris[category]} />
              ) : (
                <CategoryList
                  key={category}
                  category={category.split('#')[0]}
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
