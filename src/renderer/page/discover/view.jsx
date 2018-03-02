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
import type { Subscription } from 'redux/reducers/subscriptions';

type SavedSubscriptions = Array<Subscription>;

type Props = {
  doFetchClaimsByChannel: (string, number) => any,
  savedSubscriptions: SavedSubscriptions,
  // TODO build out claim types
  subscriptions: Array<any>,
  setHasFetchedSubscriptions: () => void,
  hasFetchedSubscriptions: boolean,
};


class DiscoverPage extends React.PureComponent<Props> {
  componentWillMount() {
    this.props.fetchFeaturedUris();
  }


  componentDidMount() {
    const { savedSubscriptions, setHasFetchedSubscriptions } = this.props;
    if (savedSubscriptions.length > 0) {
      this.fetchSubscriptions(savedSubscriptions);
      setHasFetchedSubscriptions();
    }
  }

  componentWillReceiveProps(props: Props) {
    const { savedSubscriptions, hasFetchedSubscriptions, setHasFetchedSubscriptions } = props;

    if (!hasFetchedSubscriptions && savedSubscriptions.length) {
      this.fetchSubscriptions(savedSubscriptions);
      setHasFetchedSubscriptions();
    }
  }

  fetchSubscriptions(savedSubscriptions: SavedSubscriptions) {
    const { doFetchClaimsByChannel } = this.props;
    if (savedSubscriptions.length) {
      // can this use batchActions?
      savedSubscriptions.forEach(sub => {
        doFetchClaimsByChannel(sub.uri, 1);
      });
    }
  }


  render() {
    const {
      featuredUris,
      fetchingFeaturedUris,
      subscriptions,
      savedSubscriptions,
    } = this.props;
    const hasContent = typeof featuredUris === 'object' && Object.keys(featuredUris).length,
      failedToLoad = !fetchingFeaturedUris && !hasContent;

    if (subscriptions) console.log("subscriptions:", subscriptions);

    const someClaimsNotLoaded = Boolean(
      subscriptions.find(subscription => !subscription.claims.length)
    );

    const fetchingSubscriptions =
      !!savedSubscriptions.length &&
      (subscriptions.length !== savedSubscriptions.length || someClaimsNotLoaded);
  
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
            uri =>
              featuredUris[uri].length > 0 ? (
                <FeaturedCategory
                  key={uri}
                  category={uri}
                  uris={featuredUris[uri]}
                />
              ) : null
          )}
        {failedToLoad && <div className="empty">{__('Failed to load landing content.')}</div>}
        {!!savedSubscriptions.length && (
          <div>
            {!!subscriptions.length &&
              subscriptions.map(subscription => {
                if (!subscription.claims.length) {
                  // will need to update when you can subscribe to empty channels
                  // for now this prevents issues with FeaturedCategory being rendered
                  // before the names (claim uris) are populated
                  return '';
                }

                return (
                  <FeaturedCategory
                    key={subscription.channelName}
                    categoryLink={subscription.uri}
                    category={subscription.channelName}
                    uris={subscription.claims}
                  />
                );
              })}
          </div>
        )}
      </main>
    );
  }
}

export default DiscoverPage;
