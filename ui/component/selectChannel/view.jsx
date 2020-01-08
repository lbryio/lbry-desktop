// @flow
import React, { Fragment } from 'react';
import { FormField } from 'component/common/form';
import BusyIndicator from 'component/common/busy-indicator';
import ChannelCreate from 'component/channelCreate';

import { CHANNEL_NEW, CHANNEL_ANONYMOUS } from 'constants/claim';

type Props = {
  channel: string, // currently selected channel
  channels: ?Array<ChannelClaim>,
  balance: number,
  onChannelChange: string => void,
  createChannel: (string, number) => Promise<any>,
  fetchChannelListMine: () => void,
  fetchingChannels: boolean,
  emailVerified: boolean,
  includeAnonymous?: boolean,
  includeNew?: boolean,
  label?: string,
  injected?: Array<string>,
};

type State = {
  addingChannel: boolean,
};

class ChannelSection extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      addingChannel: false,
    };

    (this: any).handleChannelChange = this.handleChannelChange.bind(this);
    (this: any).handleChangeToNewChannel = this.handleChangeToNewChannel.bind(this);
  }

  componentDidMount() {
    const { channels, fetchChannelListMine, fetchingChannels, emailVerified } = this.props;
    if (IS_WEB && !emailVerified) {
      return;
    }

    if ((!channels || !channels.length) && !fetchingChannels) {
      fetchChannelListMine();
    }
  }

  handleChannelChange(event: SyntheticInputEvent<*>) {
    const { onChannelChange } = this.props;
    const channel = event.target.value;

    if (channel === CHANNEL_NEW) {
      this.setState({ addingChannel: true });
      onChannelChange(channel);
    } else {
      this.setState({ addingChannel: false });
      onChannelChange(channel);
    }
  }

  handleChangeToNewChannel(props: Object) {
    const { onChannelChange } = this.props;
    const { newChannelName } = props;

    this.setState({ addingChannel: false });

    const channelName = `@${newChannelName.trim()}`;
    onChannelChange(channelName);
  }

  render() {
    const channel = this.state.addingChannel ? 'new' : this.props.channel;
    const { fetchingChannels, channels = [], includeAnonymous, includeNew, label, injected = [] } = this.props;
    const { addingChannel } = this.state;

    return (
      <Fragment>
        {fetchingChannels ? (
          <BusyIndicator message="Updating channels" />
        ) : (
          <Fragment>
            <div className="section">
              <FormField
                name="channel"
                label={label || __('Channel')}
                type="select"
                onChange={this.handleChannelChange}
                value={channel}
              >
                {includeAnonymous && <option value={CHANNEL_ANONYMOUS}>{__('Anonymous')}</option>}
                {channels &&
                  channels.map(({ name, claim_id: claimId }) => (
                    <option key={claimId} value={name}>
                      {name}
                    </option>
                  ))}
                {injected &&
                  injected.map(item => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                {includeNew && <option value={CHANNEL_NEW}>{__('New channel...')}</option>}
              </FormField>
            </div>
            {addingChannel && (
              <div className="section">
                <ChannelCreate onSuccess={this.handleChangeToNewChannel} />
              </div>
            )}
          </Fragment>
        )}
      </Fragment>
    );
  }
}

export default ChannelSection;
