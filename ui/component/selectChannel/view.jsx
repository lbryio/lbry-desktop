// @flow
import { CHANNEL_NEW, CHANNEL_ANONYMOUS } from 'constants/claim';
import React, { Fragment } from 'react';
import { FormField } from 'component/common/form';
import ChannelCreate from 'component/channelCreate';

type Props = {
  channel: string, // currently selected channel
  channels: ?Array<ChannelClaim>,
  balance: number,
  onChannelChange: string => void,
  createChannel: (string, number) => Promise<any>,
  fetchChannelListMine: () => void,
  fetchingChannels: boolean,
  hideAnon: boolean,
  hideNew: boolean,
  label?: string,
  injected?: Array<string>,
  emailVerified: boolean,
  tiny: boolean,
};

type State = {
  addingChannel: boolean,
};

const ID_FF_SELECT_CHANNEL = 'ID_FF_SELECT_CHANNEL';

class ChannelSelection extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      addingChannel: props.channel === CHANNEL_NEW,
    };

    (this: any).handleChannelChange = this.handleChannelChange.bind(this);
    (this: any).handleChangeToNewChannel = this.handleChangeToNewChannel.bind(this);
  }

  componentDidMount() {
    const { channel, channels, fetchChannelListMine, fetchingChannels, emailVerified, onChannelChange } = this.props;
    if (IS_WEB && !emailVerified) {
      return;
    }

    if ((!channels || !channels.length) && !fetchingChannels) {
      fetchChannelListMine();
    }

    if (channels && channels.length && !channels.find(chan => chan.name === channel)) {
      const elem = document.getElementById(ID_FF_SELECT_CHANNEL);
      // $FlowFixMe
      if (elem && elem.value && elem.value !== channel) {
        setTimeout(() => {
          // $FlowFixMe
          onChannelChange(elem.value);
        }, 250);
      }
    }
  }

  componentDidUpdate() {
    const { channels, fetchingChannels, hideAnon } = this.props;
    if (!fetchingChannels && !channels && hideAnon) {
      this.setState({ addingChannel: true });
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
    const channel = this.state.addingChannel ? CHANNEL_NEW : this.props.channel;
    const { fetchingChannels, channels = [], hideAnon, hideNew, label, injected = [], tiny } = this.props;
    const { addingChannel } = this.state;

    return (
      <Fragment>
        <FormField
          id={ID_FF_SELECT_CHANNEL}
          name="channel"
          label={!tiny && (label || __('Channel'))}
          labelOnLeft={tiny}
          type={tiny ? 'select-tiny' : 'select'}
          onChange={this.handleChannelChange}
          value={channel}
        >
          {!hideAnon && <option value={CHANNEL_ANONYMOUS}>{__('Anonymous')}</option>}
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
          {!fetchingChannels && !hideNew && <option value={CHANNEL_NEW}>{__('New channel...')}</option>}
        </FormField>

        {addingChannel && <ChannelCreate onSuccess={this.handleChangeToNewChannel} />}
      </Fragment>
    );
  }
}

export default ChannelSelection;
