import React from "react";
import { Icon } from "component/common";

class UriIndicator extends React.PureComponent {
  componentWillMount() {
    this.resolve(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.resolve(nextProps);
  }

  resolve(props) {
    const { isResolvingUri, resolveUri, claim, uri } = props;

    if (!isResolvingUri && claim === undefined && uri) {
      resolveUri(uri);
    }
  }

  render() {
    const { claim, uri, isResolvingUri } = this.props;

    if (isResolvingUri && !claim) {
      return <span className="empty">Validating...</span>;
    }

    if (!claim) {
      return <span className="empty">Unused</span>;
    }

    const {
      channel_name: channelName,
      has_signature: hasSignature,
      signature_is_valid: signatureIsValid,
    } = claim;

    if (!hasSignature || !channelName) {
      return <span className="empty">Anonymous</span>;
    }

    let icon, modifier;
    if (signatureIsValid) {
      modifier = "valid";
    } else {
      icon = "icon-times-circle";
      modifier = "invalid";
    }

    return (
      <span>
        {channelName} {" "}
        {!signatureIsValid
          ? <Icon
              icon={icon}
              className={`channel-indicator__icon channel-indicator__icon--${modifier}`}
            />
          : ""}
      </span>
    );
  }
}

export default UriIndicator;
