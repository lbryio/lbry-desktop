// @flow
import React from 'react';
import Page from 'component/page';
import CategoryList from 'component/common/category-list';

type Props = {
  fetchFeaturedUris: () => void,
  fetchingFeaturedUris: boolean,
  featuredUris: {},
};

class DiscoverPage extends React.PureComponent<Props> {
  componentWillMount() {
    this.props.fetchFeaturedUris();
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
                ''
              )
          )}
        {failedToLoad && <div className="empty">{__('Failed to load landing content.')}</div>}
      </Page>
    );
  }
}

export default DiscoverPage;
