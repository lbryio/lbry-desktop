// @flow
import React from 'react';
import Page from 'component/page';
import { BusyMessage } from 'component/common';
import CategoryList from 'component/common/category-list';
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

export default class extends React.PureComponent<Props> {
  // setHasFetchedSubscriptions is a terrible hack
  // it allows the subscriptions to load correctly when refresing on the subscriptions page
  // currently the page is rendered before the state is rehyrdated
  // that causes this component to be rendered with zero savedSubscriptions
  // we need to wait until persist/REHYDRATE has fired before rendering the page
  componentDidMount() {
    const { savedSubscriptions, setHasFetchedSubscriptions } = this.props;
    if (savedSubscriptions.length) {
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
    const { subscriptions, savedSubscriptions } = this.props;

    const someClaimsNotLoaded = Boolean(
      subscriptions.find(subscription => !subscription.claims.length)
    );

    const fetchingSubscriptions =
      !!savedSubscriptions.length &&
      (subscriptions.length !== savedSubscriptions.length || someClaimsNotLoaded);

    return (
      <Page noPadding isLoading={fetchingSubscriptions}>
        {!savedSubscriptions.length && (
          <span>{__("You haven't subscribed to any channels yet")}</span>
        )}
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
                  <CategoryList
                    key={subscription.channelName}
                    categoryLink={subscription.uri}
                    category={subscription.channelName}
                    names={subscription.claims}
                  />
                );
              })}
          </div>
        )}
      </Page>
    );
  }
}
