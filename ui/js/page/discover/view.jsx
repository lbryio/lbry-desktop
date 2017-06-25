import React from "react";
import FeaturedCategory from "component/discover/FeaturedCategory";
import { BusyMessage } from "component/common.js";

class DiscoverPage extends React.PureComponent {
  componentWillMount() {
    this.props.fetchFeaturedUris();
  }

  render() {
    const { featuredUris, fetchingFeaturedUris } = this.props;
    const failedToLoad =
      !fetchingFeaturedUris &&
      (featuredUris === undefined ||
        (featuredUris !== undefined && Object.keys(featuredUris).length === 0));

    return (
      <main>
        {fetchingFeaturedUris &&
          <BusyMessage message={__("Fetching content")} />}
        {typeof featuredUris === "object" &&
          Object.keys(featuredUris).map(
            category =>
              featuredUris[category].length
                ? <FeaturedCategory
                    key={category}
                    category={category}
                    names={featuredUris[category]}
                  />
                : ""
          )}
        {failedToLoad &&
          <div className="empty">{__("Failed to load landing content.")}</div>}
      </main>
    );
  }
}

export default DiscoverPage;
