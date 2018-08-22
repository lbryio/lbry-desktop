// @flow
import React from 'react';
import Page from 'component/page';
import type { Subscription } from 'types/subscription';
import * as NOTIFICATION_TYPES from 'constants/notification_types';
import Button from 'component/button';
import FileList from 'component/fileList';
import type { Claim } from 'types/claim';
import HiddenNsfwClaims from 'component/hiddenNsfwClaims';

type Props = {
  doFetchMySubscriptions: () => void,
  setSubscriptionNotifications: ({}) => void,
  subscriptions: Array<Subscription>,
  subscriptionClaims: Array<{ uri: string, claims: Array<Claim> }>,
  notifications: {},
  loading: boolean,
};

export default class extends React.PureComponent<Props> {
  componentDidMount() {
    const { notifications, setSubscriptionNotifications, doFetchMySubscriptions } = this.props;
    doFetchMySubscriptions();

    // @sean will change this behavior when implementing new content labeling
    // notifications should be cleared individually
    // do we want a way to clear individual claims without viewing?
    const newNotifications = {};
    Object.keys(notifications).forEach(cur => {
      if (notifications[cur].type === NOTIFICATION_TYPES.DOWNLOADING) {
        newNotifications[cur] = { ...notifications[cur] };
      }
    });
    setSubscriptionNotifications(newNotifications);
  }

  render() {
    const { subscriptions, subscriptionClaims, loading } = this.props;

    let claimList = [];
    subscriptionClaims.forEach(claimData => {
      claimList = claimList.concat(claimData.claims);
    });

    const subscriptionUris = claimList.map(claim => `lbry://${claim.name}#${claim.claim_id}`);

    return (
      <Page notContained loading={loading}>
        <HiddenNsfwClaims uris={subscriptionUris} />
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
