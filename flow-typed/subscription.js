// @flow
import * as ACTIONS from 'constants/action_types';
import {
  DOWNLOADED,
  DOWNLOADING,
  NOTIFY_ONLY,
  VIEW_ALL,
  VIEW_LATEST_FIRST,
  SUGGESTED_TOP_BID,
  SUGGESTED_TOP_SUBSCRIBED,
  SUGGESTED_FEATURED,
} from 'constants/subscriptions';

declare type Subscription = {
  channelName: string, // @CryptoCandor,
  uri: string, // lbry://@CryptoCandor#9152f3b054f692076a6882d1b58a30e8781cc8e6
  notificationsDisabled?: boolean,
};

declare type Following = {
  uri: string, // lbry://@CryptoCandor#9152f3b054f692076a6882d1b58a30e8781cc8e6
  notificationsDisabled: boolean,
};

declare type SubscriptionState = {
  subscriptions: Array<Subscription>,
  following: Array<Following>,
  loading: boolean,
  firstRunCompleted: boolean,
};
