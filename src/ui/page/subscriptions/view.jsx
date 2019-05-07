// @flow
import * as SETTINGS from 'constants/settings';
import React, { PureComponent } from 'react';
import Page from 'component/page';
import FirstRun from './internal/first-run';
import UserSubscriptions from './internal/user-subscriptions';

type Props = {
  subscribedChannels: Array<string>, // The channels a user is subscribed to
  unreadSubscriptions: Array<{
    channel: string,
    uris: Array<string>,
  }>,
  allSubscriptions: Array<{ uri: string, ...StreamClaim }>,
  loading: boolean,
  autoDownload: boolean,
  viewMode: ViewMode,
  doSetViewMode: ViewMode => void,
  doFetchMySubscriptions: () => void,
  doSetClientSetting: (string, boolean) => void,
  doFetchRecommendedSubscriptions: () => void,
  loadingSuggested: boolean,
  firstRunCompleted: boolean,
  doCompleteFirstRun: () => void,
  doShowSuggestedSubs: () => void,
  showSuggestedSubs: boolean,
};

export default class SubscriptionsPage extends PureComponent<Props> {
  constructor() {
    super();

    (this: any).onAutoDownloadChange = this.onAutoDownloadChange.bind(this);
  }

  componentDidMount() {
    const {
      doFetchMySubscriptions,
      doFetchRecommendedSubscriptions,
      allSubscriptions,
      firstRunCompleted,
      doShowSuggestedSubs,
    } = this.props;

    doFetchMySubscriptions();
    doFetchRecommendedSubscriptions();

    // For channels that already have subscriptions, show the suggested subs right away
    // This can probably be removed at a future date, it is just to make it so the "view your x subscriptions" button shows up right away
    // Existing users will still go through the "first run"
    if (!firstRunCompleted && allSubscriptions.length) {
      doShowSuggestedSubs();
    }
  }

  onAutoDownloadChange(event: SyntheticInputEvent<*>) {
    this.props.doSetClientSetting(SETTINGS.AUTO_DOWNLOAD, event.target.checked);
  }

  render() {
    const {
      subscribedChannels,
      allSubscriptions,
      loading,
      autoDownload,
      viewMode,
      doSetViewMode,
      loadingSuggested,
      firstRunCompleted,
      doCompleteFirstRun,
      doShowSuggestedSubs,
      showSuggestedSubs,
      unreadSubscriptions,
    } = this.props;
    const numberOfSubscriptions = subscribedChannels && subscribedChannels.length;

    return (
      // Only pass in the loading prop if there are no subscriptions
      // If there are any, let the page update in the background
      // The loading prop removes children and shows a loading spinner
      <Page notContained loading={loading && !subscribedChannels} className="main--no-padding-top">
        {firstRunCompleted ? (
          <UserSubscriptions
            viewMode={viewMode}
            doSetViewMode={doSetViewMode}
            hasSubscriptions={numberOfSubscriptions > 0}
            subscriptions={allSubscriptions}
            autoDownload={autoDownload}
            onChangeAutoDownload={this.onAutoDownloadChange}
            unreadSubscriptions={unreadSubscriptions}
            loadingSuggested={loadingSuggested}
          />
        ) : (
          <FirstRun
            showSuggested={showSuggestedSubs}
            doShowSuggestedSubs={doShowSuggestedSubs}
            loadingSuggested={loadingSuggested}
            numberOfSubscriptions={numberOfSubscriptions}
            onFinish={doCompleteFirstRun}
          />
        )}
      </Page>
    );
  }
}
