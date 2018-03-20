import React from 'react';
import ReactDOM from 'react-dom';
import { normalizeURI } from 'lbryURI';
import FileCard from 'component/fileCard';
import { BusyMessage } from 'component/common.js';
import Icon from 'component/icon';
import ToolTip from 'component/tooltip.js';
import SubHeader from 'component/subHeader';
import classnames from 'classnames';
import Link from 'component/link';
import FeaturedCategory from 'component/featuredCategory';

class DiscoverPage extends React.PureComponent {
  componentWillMount() {
    this.props.fetchFeaturedUris();
  }

  render() {
    const { featuredUris, fetchingFeaturedUris } = this.props;
    const hasContent = typeof featuredUris === 'object' && Object.keys(featuredUris).length;
    const failedToLoad = !fetchingFeaturedUris && !hasContent;

    return (
      <main
        className={classnames('main main--no-margin', {
          reloading: hasContent && fetchingFeaturedUris,
        })}
      >
        <SubHeader fullWidth smallMargin />
        {!hasContent && fetchingFeaturedUris && <BusyMessage message={__('Fetching content')} />}
        {hasContent &&
          Object.keys(featuredUris).map(
            category => {
              if (category.indexOf("@") === 0) {
                return (
                  <FeaturedCategory
                    key={category}
                    category={category.split("#")[0]}
                    categoryLink={category}
                    names={[]}
                  />
                )
              }
              return featuredUris[category].length ? (
                <FeaturedCategory
                  key={category}
                  category={category}
                  names={featuredUris[category]}
                />
              ) : (
                ''
              )
            }
          )}
        {failedToLoad && <div className="empty">{__('Failed to load landing content.')}</div>}
      </main>
    );
  }
}

export default DiscoverPage;
