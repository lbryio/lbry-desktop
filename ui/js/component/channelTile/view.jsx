import React from "react";
import CardMedia from "component/cardMedia";
import { TruncatedText, BusyMessage } from "component/common.js";

class ChannelTile extends React.PureComponent {
  componentDidMount() {
    const { uri, resolveUri } = this.props;

    resolveUri(uri);
  }

  componentWillReceiveProps(nextProps) {
    const { uri, resolveUri } = this.props;

    if (nextProps.uri != uri) {
      resolveUri(uri);
    }
  }

  render() {
    const { claim, navigate, isResolvingUri, totalItems, uri } = this.props;
    let channelName, channelId;

    if (claim) {
      channelName = claim.name;
      channelId = claim.claim_id;
    }

    let onClick = () => navigate("/show", { uri });

    return (
      <section className="file-tile card">
        <div onClick={onClick} className="card__link">
          <div className={"card__inner file-tile__row"}>
            {channelName && <CardMedia title={channelName} thumbnail={null} />}
            <div className="file-tile__content">
              <div className="card__title-primary">
                <h3>
                  <TruncatedText lines={1}>{channelName || uri}</TruncatedText>
                </h3>
              </div>
              <div className="card__content card__subtext">
                {isResolvingUri &&
                  <BusyMessage message={__("Resolving channel")} />}
                {totalItems > 0 &&
                  <span>
                    This is a channel with {totalItems}{" "}
                    {totalItems === 1 ? " item" : " items"} inside of it.
                  </span>}
                {!isResolvingUri &&
                  !totalItems &&
                  <span className="empty">This is an empty channel.</span>}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
}

export default ChannelTile;
