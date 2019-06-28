// @flow
import * as PAGES from 'constants/pages';
import React, { useEffect } from 'react';
import Page from 'component/page';
import ClaimList from 'component/claimList';
import Button from 'component/button';

type Props = {
  subscribedChannels: Array<{ uri: string }>, // The channels a user is subscribed to
  suggestedSubscriptions: Array<{ uri: string }>,
  loading: boolean,
  doFetchMySubscriptions: () => void,
  doFetchRecommendedSubscriptions: () => void,
  location: { search: string },
  history: { push: string => void },
  doClaimSearch: (number, {}) => void,
  uris: Array<string>,
};

export default function SubscriptionsPage(props: Props) {
  const {
    subscribedChannels,
    doFetchMySubscriptions,
    doFetchRecommendedSubscriptions,
    suggestedSubscriptions,
    loading,
    location,
    history,
    doClaimSearch,
    uris,
  } = props;

  const hasSubscriptions = !!subscribedChannels.length;
  const { search } = location;
  const urlParams = new URLSearchParams(search);
  const viewingSuggestedSubs = urlParams.get('view');

  function onClick() {
    let url = `/$/${PAGES.FOLLOWING}`;
    if (!viewingSuggestedSubs) {
      url += '?view=discover';
    }

    history.push(url);
  }

  useEffect(() => {
    doFetchMySubscriptions();
    doFetchRecommendedSubscriptions();
  }, [doFetchMySubscriptions, doFetchRecommendedSubscriptions]);

  const idString = subscribedChannels.map(channel => channel.uri.split('#')[1]).join(',');
  useEffect(() => {
    const ids = idString.split(',');
    const options = {
      channel_ids: ids,
      order_by: ['release_time'],
    };

    doClaimSearch(20, options);
  }, [idString, doClaimSearch]);

  return (
    <Page>
      <div className="card">
        <ClaimList
          loading={loading}
          header={<h1>{viewingSuggestedSubs ? __('Discover New Channels') : __('Latest From Your Subscriptions')}</h1>}
          headerAltControls={
            <Button
              button="link"
              label={viewingSuggestedSubs ? hasSubscriptions && __('Following') : __('Find New Channels')}
              onClick={() => onClick()}
            />
          }
          uris={viewingSuggestedSubs ? suggestedSubscriptions.map(sub => sub.uri) : uris}
        />
      </div>
    </Page>
  );
}
