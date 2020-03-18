// @flow
import React from 'react';
import Page from 'component/page';
import Spinner from 'component/spinner';
import Button from 'component/button';
import CreatorAnalytics from 'component/creatorAnalytics';

type Props = {
  channels: Array<ChannelClaim>,
  fetchingChannels: boolean,
  openChannelCreateModal: () => void,
};

export default function CreatorDashboardPage(props: Props) {
  const { channels, fetchingChannels, openChannelCreateModal } = props;

  return (
    <Page>
      {fetchingChannels && (
        <div className="main--empty">
          <Spinner delayed />
        </div>
      )}

      {!fetchingChannels && (!channels || !channels.length) && (
        <section className="main--empty">
          <div className=" section--small">
            <h2 className="section__title--large">{__("You haven't created a channel yet, let's fix that!")}</h2>
            <div className="section__actions">
              <Button button="primary" onClick={openChannelCreateModal} label={__('Create A Channel')} />
            </div>
          </div>
        </section>
      )}

      {!fetchingChannels && channels && channels.length && <CreatorAnalytics />}
    </Page>
  );
}
