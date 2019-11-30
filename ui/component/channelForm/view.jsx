// @flow

/*
  On submit, this component calls publish, which dispatches doPublishDesktop.
  doPublishDesktop calls lbry-redux Lbry publish method using lbry-redux publish state as params.
  Publish simply instructs the SDK to find the file path on disk and publish it with the provided metadata.
  On web, the Lbry publish method call is overridden in platform/web/api-setup, using a function in platform/web/publish.
  File upload is carried out in the background by that function.
 */
import React, { useEffect, Fragment } from 'react';
import { CHANNEL_NEW, CHANNEL_ANONYMOUS } from 'constants/claim';
import { buildURI, isURIValid } from 'lbry-redux';
import ChannelCreate from 'component/channelCreate';
import Card from 'component/common/card';
import * as ICONS from 'constants/icons';

type Props = {
  name: ?string,
  channel: string,
  resolveUri: string => void,
  // Add back type
  updatePublishForm: any => void,
  onSuccess: () => void,
};

function ChannelForm(props: Props) {
  const { name, channel, resolveUri, updatePublishForm, onSuccess } = props;

  // Every time the channel or name changes, resolve the uris to find winning bid amounts
  useEffect(() => {
    // If they are midway through a channel creation, treat it as anonymous until it completes
    const channelName = channel === CHANNEL_ANONYMOUS || channel === CHANNEL_NEW ? '' : channel;

    // We are only going to store the full uri, but we need to resolve the uri with and without the channel name
    let uri;
    try {
      uri = name && buildURI({ streamName: name, channelName });
    } catch (e) {}

    if (channelName && name) {
      // resolve without the channel name so we know the winning bid for it
      try {
        const uriLessChannel = buildURI({ streamName: name });
        resolveUri(uriLessChannel);
      } catch (e) {}
    }

    const isValid = isURIValid(uri);
    if (uri && isValid) {
      resolveUri(uri);
      updatePublishForm({ uri });
    }
  }, [name, channel, resolveUri, updatePublishForm]);

  return (
    <Fragment>
      <Card
        actionIconPadding={false}
        icon={ICONS.CHANNEL}
        title="Create a New Channel"
        subtitle="This is a username or handle that your content can be found under."
        actions={
          <React.Fragment>
            <ChannelCreate onSuccess={onSuccess} onChannelChange={channel => updatePublishForm({ channel })} />
          </React.Fragment>
        }
      />
    </Fragment>
  );
}

export default ChannelForm;
