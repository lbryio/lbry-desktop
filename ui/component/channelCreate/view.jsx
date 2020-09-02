// @flow
import React from 'react';
import { isNameValid } from 'lbry-redux';
import { Form, FormField } from 'component/common/form';
import Button from 'component/button';
import analytics from 'analytics';
import LbcSymbol from 'component/common/lbc-symbol';
import { MINIMUM_PUBLISH_BID, INVALID_NAME_ERROR } from 'constants/claim';

type Props = {
  balance: number,
  createChannel: (string, number) => Promise<any>,
  onSuccess?: ({}) => void,
  creatingChannel: boolean,
  createChannelError: ?string,
};

type State = {
  newChannelName: string,
  newChannelBid: number,
  newChannelNameError: string,
  newChannelBidError: string,
};

class ChannelCreate extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      newChannelName: '',
      newChannelBid: 0.001,
      newChannelNameError: '',
      newChannelBidError: '',
    };

    (this: any).handleNewChannelNameChange = this.handleNewChannelNameChange.bind(this);
    (this: any).handleNewChannelBidChange = this.handleNewChannelBidChange.bind(this);
    (this: any).handleCreateChannel = this.handleCreateChannel.bind(this);
  }

  handleNewChannelNameChange(event: SyntheticInputEvent<*>) {
    let newChannelName = event.target.value;

    if (newChannelName.startsWith('@')) {
      newChannelName = newChannelName.slice(1);
    }

    let newChannelNameError;
    if (newChannelName.length > 0 && !isNameValid(newChannelName, false)) {
      newChannelNameError = INVALID_NAME_ERROR;
    }

    this.setState({
      newChannelNameError,
      newChannelName,
    });
  }

  handleNewChannelBidChange(newChannelBid: number) {
    const { balance } = this.props;
    let newChannelBidError;
    if (newChannelBid === 0) {
      newChannelBidError = __('Your deposit cannot be 0');
    } else if (newChannelBid === balance) {
      newChannelBidError = __('Please decrease your deposit to account for transaction fees');
    } else if (newChannelBid > balance) {
      newChannelBidError = __('Deposit cannot be higher than your balance');
    } else if (newChannelBid < MINIMUM_PUBLISH_BID) {
      newChannelBidError = __('Your deposit must be higher');
    }

    this.setState({
      newChannelBid,
      newChannelBidError,
    });
  }

  handleCreateChannel() {
    const { createChannel, onSuccess } = this.props;
    const { newChannelBid, newChannelName } = this.state;

    const channelName = `@${newChannelName.trim()}`;

    const success = channelClaim => {
      analytics.apiLogPublish(channelClaim);

      if (onSuccess !== undefined) {
        onSuccess({ ...this.props, ...this.state });
      }
    };

    createChannel(channelName, newChannelBid).then(success);
  }

  render() {
    const { newChannelName, newChannelNameError, newChannelBid, newChannelBidError } = this.state;
    const { creatingChannel, createChannelError } = this.props;

    return (
      <Form onSubmit={this.handleCreateChannel}>
        {createChannelError && <div className="error__text">{createChannelError}</div>}
        <div>
          <FormField
            label={__('Name')}
            name="channel-input"
            type="text"
            placeholder={__('ChannelName')}
            error={newChannelNameError}
            value={newChannelName}
            onChange={this.handleNewChannelNameChange}
          />
          <FormField
            className="form-field--price-amount"
            name="channel-deposit"
            label={<LbcSymbol prefix={__('Deposit')} size={14} />}
            step="any"
            min="0"
            type="number"
            helper={__(
              'These LBRY Credits remain yours. It is a deposit to reserve the name and can be undone at any time.'
            )}
            error={newChannelBidError}
            value={newChannelBid}
            onChange={event => this.handleNewChannelBidChange(parseFloat(event.target.value))}
            onWheel={e => e.stopPropagation()}
          />
          <div className="section__actions">
            <Button
              type="submit"
              button="primary"
              label={!creatingChannel ? __('Create channel') : __('Creating channel...')}
              disabled={
                !newChannelName || !newChannelBid || creatingChannel || newChannelNameError || newChannelBidError
              }
            />
          </div>
        </div>
      </Form>
    );
  }
}

export default ChannelCreate;
