// @flow

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
  lastActiveSubscriptions: ?Array<Subscription>,
  following: Array<Following>,
  loading: boolean,
  firstRunCompleted: boolean,
};
