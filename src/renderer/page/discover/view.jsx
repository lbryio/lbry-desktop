// @flow
import React from 'react';
import Page from 'component/page';
import CategoryList from 'component/categoryList';

type Props = {
  fetchFeaturedUris: () => void,
  fetchingFeaturedUris: boolean,
  featuredUris: {},
};

let featuredUrisThrottled = false;

class DiscoverPage extends React.PureComponent<Props> {
  componentWillMount() {
    if (!featuredUrisThrottled) {
      featuredUrisThrottled = true;
      this.props.fetchFeaturedUris();
      setTimeout(() => {
        featuredUrisThrottled = false;
      }, 1000 * 60 * 30);
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
