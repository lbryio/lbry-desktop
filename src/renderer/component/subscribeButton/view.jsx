import React from 'react';
import Link from 'component/link';
import * as modals from 'constants/modal_types';

export default ({ channelName, uri, subscriptions, doChannelSubscribe, doChannelUnsubscribe, doOpenModal }) => {
  const isSubscribed =
    subscriptions.map(subscription => subscription.channelName).indexOf(channelName) !== -1;

  const subscriptionHandler = isSubscribed ? doChannelUnsubscribe : doChannelSubscribe;

  const subscriptionLabel = isSubscribed ? __('Unsubscribe') : __('Subscribe');

  return channelName && uri ? (
    <div className="card__actions">
      <Link
        iconRight={isSubscribed ? '' : 'at'}
        button={isSubscribed ? 'alt' : 'primary'}
        label={subscriptionLabel}
        onClick={() => {
          if(!subscriptions.length) {
            doOpenModal(modals.FIRST_SUBSCRIPTION);
          }
          subscriptionHandler({
            channelName,
            uri,
          })
        }
        }
      />
    </div>
  ) : null;
};
