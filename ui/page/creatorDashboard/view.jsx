// @flow
import * as PAGES from 'constants/pages';
import React from 'react';
import Page from 'component/page';
import Spinner from 'component/spinner';
import Button from 'component/button';
import CreatorAnalytics from 'component/creatorAnalytics';
import ChannelSelector from 'component/channelSelector';
import usePersistedState from 'effects/use-persisted-state';
import Yrbl from 'component/yrbl';
import { useHistory } from 'react-router';

type Props = {
  channels: Array<ChannelClaim>,
  fetchingChannels: boolean,
};

const SELECTED_CHANNEL_QUERY_PARAM = 'channel';

export default function CreatorDashboardPage(props: Props) {
  const { channels, fetchingChannels } = props;
  const {
    push,
    location: { search, pathname },
  } = useHistory();
  const urlParams = new URLSearchParams(search);
  const channelFromUrl = urlParams.get(SELECTED_CHANNEL_QUERY_PARAM);
  const [selectedChannelUrl, setSelectedChannelUrl] = usePersistedState('analytics-selected-channel');
  const hasChannels = channels && channels.length > 0;
  const firstChannel = hasChannels && channels[0];
  const firstChannelUrl = firstChannel && (firstChannel.canonical_url || firstChannel.permanent_url); // permanent_url is needed for pending publishes
  const channelFoundForSelectedChannelUrl =
    channels &&
    channels.find(channel => {
      return selectedChannelUrl === channel.canonical_url || selectedChannelUrl === channel.permanent_url;
    });

  React.useEffect(() => {
    // set default channel
    if ((!selectedChannelUrl || !channelFoundForSelectedChannelUrl) && firstChannelUrl) {
      setSelectedChannelUrl(firstChannelUrl);
    }
  }, [setSelectedChannelUrl, selectedChannelUrl, firstChannelUrl, channelFoundForSelectedChannelUrl]);

  React.useEffect(() => {
    if (channelFromUrl) {
      const decodedChannel = decodeURIComponent(channelFromUrl);
      setSelectedChannelUrl(decodedChannel);
    }
  }, [channelFromUrl, setSelectedChannelUrl]);

  function updateUrl(channelUrl) {
    const newUrlParams = new URLSearchParams();
    newUrlParams.append(SELECTED_CHANNEL_QUERY_PARAM, encodeURIComponent(channelUrl));
    push(`${pathname}?${newUrlParams.toString()}`);
  }

  return (
    <Page>
      {fetchingChannels && (
        <div className="main--empty">
          <Spinner delayed />
        </div>
      )}

      {!fetchingChannels && (!channels || !channels.length) && (
        <Yrbl
          type="happy"
          title={__("You haven't created a channel yet, let's fix that!")}
          actions={
            <div className="section__actions">
              <Button button="primary" navigate={`/$/${PAGES.CHANNEL_NEW}`} label={__('Create A Channel')} />
            </div>
          }
        />
      )}

      {!fetchingChannels && channels && channels.length && (
        <React.Fragment>
          <div className="section section--padded section--help">
            <p>{__('Creator analytics are down for maintenance. Please check back later.')}</p>
          </div>

          <div className="section">
            <ChannelSelector
              selectedChannelUrl={selectedChannelUrl}
              onChannelSelect={newChannelUrl => {
                updateUrl(newChannelUrl);
                setSelectedChannelUrl(newChannelUrl);
              }}
            />
          </div>
          <CreatorAnalytics uri={selectedChannelUrl} />
        </React.Fragment>
      )}
    </Page>
  );
}
