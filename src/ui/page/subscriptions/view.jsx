// @flow
import React, { useEffect, useState } from 'react';
import Page from 'component/page';
import FileList from 'component/fileList';
import Button from 'component/button';

type Props = {
  subscribedChannels: Array<string>, // The channels a user is subscribed to
  subscriptionContent: Array<{ uri: string, ...StreamClaim }>,
  suggestedSubscriptions: Array<{ uri: string }>,
  loading: boolean,
  doFetchMySubscriptions: () => void,
  doFetchRecommendedSubscriptions: () => void,
};

export default function SubscriptionsPage(props: Props) {
  const {
    subscriptionContent,
    subscribedChannels,
    doFetchMySubscriptions,
    doFetchRecommendedSubscriptions,
    suggestedSubscriptions,
    loading,
  } = props;
  const hasSubscriptions = !!subscribedChannels.length;
  const [showSuggested, setShowSuggested] = useState(!hasSubscriptions);

  useEffect(() => {
    doFetchMySubscriptions();
    doFetchRecommendedSubscriptions();
  }, [doFetchMySubscriptions, doFetchRecommendedSubscriptions]);

  return (
    <Page>
      <div className="card">
        <FileList
          loading={loading}
          header={<h1>{showSuggested ? __('Discover New Channels') : __('Latest From Your Subscriptions')}</h1>}
          headerAltControls={
            <Button
              button="alt"
              label={showSuggested ? hasSubscriptions && __('View Your Subscriptions') : __('Find New Channels')}
              onClick={() => setShowSuggested(!showSuggested)}
            />
          }
          uris={
            showSuggested
              ? suggestedSubscriptions.map(sub => sub.uri)
              : subscriptionContent.map(sub => sub.permanent_url)
          }
        />
      </div>
    </Page>
  );
}
