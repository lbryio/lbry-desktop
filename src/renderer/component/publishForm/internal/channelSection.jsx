import React from 'react';
import { Lbryuri } from 'lbry-redux';
import { FormRow } from 'component/form';
import { BusyMessage } from 'component/common';
import Link from 'component/link';

/* eslint-disable react/prop-types, react/jsx-no-bind, jsx-a11y/tabindex-no-positive, jsx-a11y/anchor-is-valid */
class ChannelSection extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      newChannelName: '@',
      newChannelBid: 10,
      addingChannel: false,
    };
  }

  handleChannelChange(event) {
    const channel = event.target.value;
    if (channel === 'new') this.setState({ addingChannel: true });
    else {
      this.setState({ addingChannel: false });
      this.props.handleChannelChange(event.target.value);
    }
  }

  handleNewChannelNameChange(event) {
    const newChannelName = event.target.value.startsWith('@')
      ? event.target.value
      : `@${event.target.value}`;

    if (newChannelName.length > 1 && !Lbryuri.isValidName(newChannelName.substr(1), false)) {
      // eslint-disable-next-line react/no-string-refs
      this.refs.newChannelName.showError(
        __('LBRY channel names must contain only letters, numbers and dashes.')
      );
      return;
    }
    // eslint-disable-next-line react/no-string-refs
    this.refs.newChannelName.clearError();

    this.setState({
      newChannelName,
    });
  }

  handleNewChannelBidChange(event) {
    this.setState({
      newChannelBid: parseFloat(event.target.value),
    });
  }

  // eslint-disable-next-line no-unused-vars
  handleCreateChannelClick(event) {
    const { balance } = this.props;
    const { newChannelBid } = this.state;

    if (newChannelBid > balance) {
      // eslint-disable-next-line react/no-string-refs
      this.refs.newChannelName.showError(__('Unable to create channel due to insufficient funds.'));

      return;
    }

    this.setState({
      creatingChannel: true,
    });

    // eslint-disable-next-line prefer-destructuring
    const newChannelName = this.state.newChannelName;
    const amount = parseFloat(this.state.newChannelBid);
    this.setState({
      creatingChannel: true,
    });
    const success = () => {
      this.setState({
        creatingChannel: false,
        addingChannel: false,
        // eslint-disable-next-line react/no-unused-state
        channel: newChannelName,
      });
      this.props.handleChannelChange(newChannelName);
    };
    // eslint-disable-next-line no-unused-vars
    const failure = err => {
      this.setState({
        creatingChannel: false,
      });
      // eslint-disable-next-line react/no-string-refs
      this.refs.newChannelName.showError(__('Unable to create channel due to an internal error.'));
    };
    this.props.createChannel(newChannelName, amount).then(success, failure);
  }

  render() {
    const lbcInputHelp = __(
      'This LBC remains yours. It is a deposit to reserve the name and can be undone at any time.'
    );

    const channel = this.state.addingChannel ? 'new' : this.props.channel;
    const { fetchingChannels, channels = [] } = this.props;

    const channelSelector = (
      <FormRow
        key="channel"
        type="select"
        tabIndex="1"
        onChange={this.handleChannelChange.bind(this)}
        value={channel}
      >
        <option key="anonymous" value="anonymous">
          {__('Anonymous')}
        </option>
        {channels.map(({ name }) => (
          <option key={name} value={name}>
            {name}
          </option>
        ))}
        <option key="new" value="new">
          {__('New channel...')}
        </option>
      </FormRow>
    );

    /* eslint-disable react/no-string-refs */
    return (
      <section className="card">
        <div className="card__title-primary">
          <h4>{__('Channel Name')}</h4>
          <div className="card__subtitle">
            {__('This is a username or handle that your content can be found under.')}{' '}
            {__('Ex. @Marvel, @TheBeatles, @BooksByJoe')}
          </div>
        </div>
        <div className="card__content">
          {fetchingChannels ? (
            <BusyMessage message="Updating channels" key="loading" />
          ) : (
            channelSelector
          )}
        </div>
        {this.state.addingChannel && (
          <div className="card__content">
            <FormRow
              label={__('Name')}
              type="text"
              onChange={this.handleNewChannelNameChange.bind(this)}
              value={this.state.newChannelName}
            />
            <FormRow
              label={__('Deposit')}
              postfix="LBC"
              step="any"
              min="0"
              type="number"
              helper={lbcInputHelp}
              ref="newChannelName"
              onChange={this.handleNewChannelBidChange.bind(this)}
              value={this.state.newChannelBid}
            />
            <div className="form-row-submit">
              <Link
                button="primary"
                label={
                  !this.state.creatingChannel ? __('Create channel') : __('Creating channel...')
                }
                onClick={this.handleCreateChannelClick.bind(this)}
                disabled={this.state.creatingChannel}
              />
            </div>
          </div>
        )}
      </section>
    );
  }
}

export default ChannelSection;
