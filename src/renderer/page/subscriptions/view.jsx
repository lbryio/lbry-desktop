// @flow
import React from 'react';
import Page from 'component/page';
import type { Subscription } from 'types/subscription';
import * as NOTIFICATION_TYPES from 'constants/notification_types';
import Button from 'component/button';
import FileList from 'component/fileList';
import type { Claim } from 'types/claim';

type Props = {
  doFetchClaimsByChannel: (string, number) => void,
  doFetchMySubscriptions: () => void,
  setSubscriptionNotifications: ({}) => void,
  subscriptions: Array<Subscription>,
  isFetchingSubscriptions: boolean,
  subscriptionClaims: Array<{ uri: string, claims: Array<Claim> }>,
  subscriptionsBeingFetched: {},
  notifications: {},
};

export default class extends React.PureComponent<Props> {
  componentDidMount() {
    const { notifications, setSubscriptionNotifications, doFetchMySubscriptions } = this.props;
    doFetchMySubscriptions();

    const newNotifications = {};
    Object.keys(notifications).forEach(cur => {
      if (notifications[cur].type === NOTIFICATION_TYPES.DOWNLOADING) {
        newNotifications[cur] = { ...notifications[cur] };
      }
    });
    setSubscriptionNotifications(newNotifications);
  }

  componentDidUpdate() {
    const {
      subscriptions,
      subscriptionClaims,
      doFetchClaimsByChannel,
      subscriptionsBeingFetched,
    } = this.props;

    const subscriptionClaimMap = {};
    subscriptionClaims.forEach(claim => {
      subscriptionClaimMap[claim.uri] = 1;
    });

    subscriptions.forEach(sub => {
      if (!subscriptionClaimMap[sub.uri] && !subscriptionsBeingFetched[sub.uri]) {
        doFetchClaimsByChannel(sub.uri, 1);
      }
    });
  }

  render() {
    const { subscriptions, subscriptionClaims, isFetchingSubscriptions } = this.props;

    let claimList = [];
    subscriptionClaims.forEach(claimData => {
      claimList = claimList.concat(claimData.claims);
    });

    return (
      <Page notContained loading={isFetchingSubscriptions}>
        {!subscriptions.length && (
          <div className="page__empty">
            {__("It looks like you aren't subscribed to any channels yet.")}
            <div className="card__actions card__actions--center">
              <Button button="primary" navigate="/discover" label={__('Explore new content')} />
            </div>
          </div>
        )}
        {!!claimList.length && <FileList hideFilter sortByHeight fileInfos={claimList} />}
      </Page>
    );
  }
}
