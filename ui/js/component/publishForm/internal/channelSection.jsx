import React from "react";
import lbryuri from "lbryuri";
import { FormRow } from "component/form.js";
import { BusyMessage } from "component/common";
import Link from "component/link";

class ChannelSection extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      newChannelName: "@",
      newChannelBid: 10,
      addingChannel: false,
    };
  }

  handleChannelChange(event) {
    const channel = event.target.value;
    if (channel === "new") this.setState({ addingChannel: true });
    else {
      this.setState({ addingChannel: false });
      this.props.handleChannelChange(event.target.value);
    }
  }

  handleNewChannelNameChange(event) {
    const newChannelName = event.target.value.startsWith("@")
      ? event.target.value
      : "@" + event.target.value;

    if (
      newChannelName.length > 1 &&
      !lbryuri.isValidName(newChannelName.substr(1), false)
    ) {
      this.refs.newChannelName.showError(
        __("LBRY channel names must contain only letters, numbers and dashes.")
      );
      return;
    } else {
      this.refs.newChannelName.clearError();
    }

    this.setState({
      newChannelName,
    });
  }

  handleNewChannelBidChange(event) {
    this.setState({
      newChannelBid: event.target.value,
    });
  }

  handleCreateChannelClick(event) {
    if (this.state.newChannelName.length < 5) {
      this.refs.newChannelName.showError(
        __("LBRY channel names must be at least 4 characters in length.")
      );
      return;
    }

    this.setState({
      creatingChannel: true,
    });

    const newChannelName = this.state.newChannelName;
    const amount = parseFloat(this.state.newChannelBid);
    this.setState({
      creatingChannel: true,
    });
    const success = () => {
      this.setState({
        creatingChannel: false,
        addingChannel: false,
        channel: newChannelName,
      });
      this.props.handleChannelChange(newChannelName);
    };
    const failure = err => {
      this.setState({
        creatingChannel: false,
      });
      this.refs.newChannelName.showError(
        __("Unable to create channel due to an internal error.")
      );
    };
    this.props.createChannel(newChannelName, amount).then(success, failure);
  }

  render() {
    const lbcInputHelp = __(
      "This LBC remains yours and the deposit can be undone at any time."
    );

    const channel = this.state.addingChannel ? "new" : this.props.channel;
    const { fetchingChannels, channels = [] } = this.props;

    let channelContent = [];
    channelContent.push(
      <FormRow
        key="channel"
        type="select"
        tabIndex="1"
        onChange={this.handleChannelChange.bind(this)}
        value={channel}
      >
        <option key="anonymous" value="anonymous">
          {__("Anonymous")}
        </option>
        {this.props.channels.map(({ name }) =>
          <option key={name} value={name}>{name}</option>
        )}
        <option key="new" value="new">
          {__("New channel...")}
        </option>
      </FormRow>
    );
    if (fetchingChannels) {
      channelContent.push(
        <BusyMessage message="Updating channels" key="loading" />
      );
    }

    return (
      <section className="card">
        <div className="card__title-primary">
          <h4>{__("Channel Name")}</h4>
          <div className="card__subtitle">
            {__(
              "This is a username or handle that your content can be found under."
            )}
            {" "}
            {__("Ex. @Marvel, @TheBeatles, @BooksByJoe")}
          </div>
        </div>
        <div className="card__content">
          {channelContent}
        </div>
        {this.state.addingChannel &&
          <div className="card__content">
            <FormRow
              label={__("Name")}
              type="text"
              onChange={this.handleNewChannelNameChange.bind(this)}
              value={this.state.newChannelName}
            />
            <FormRow
              label={__("Deposit")}
              postfix="LBC"
              step="0.1"
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
                  !this.state.creatingChannel
                    ? __("Create channel")
                    : __("Creating channel...")
                }
                onClick={this.handleCreateChannelClick.bind(this)}
                disabled={this.state.creatingChannel}
              />
            </div>
          </div>}
      </section>
    );
  }
}

export default ChannelSection;
