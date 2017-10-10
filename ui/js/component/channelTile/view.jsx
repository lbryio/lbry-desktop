import React from "react";
import { TruncatedText, BusyMessage } from "component/common.js";

class ChannelTile extends React.PureComponent {
  componentDidMount() {
    const { uri, fetchClaimCount } = this.props;

    fetchClaimCount(uri);
  }

  componentWillReceiveProps(nextProps) {
    const { uri, fetchClaimCount } = this.props;

    if (nextProps.uri != uri) {
      fetchClaimCount(uri);
    }
  }

  render() {
    const { navigate, totalItems, uri } = this.props;

    let onClick = () => navigate("/show", { uri });

    return (
      <section className="file-tile card">
        <div onClick={onClick} className="card__link">
          <div className="file-tile__content">
            <div className="card__title-primary">
              <h3>
                <TruncatedText lines={1}>{uri}</TruncatedText>
              </h3>
            </div>
            <div className="card__content card__subtext">
              {isNaN(totalItems) &&
                <BusyMessage message={__("Resolving channel")} />}
              {totalItems > 0 &&
                <span>
                  This is a channel with over {totalItems} items inside of it.
                </span>}
              {totalItems === 0 &&
                <span className="empty">This is an empty channel.</span>}
            </div>
          </div>
        </div>
      </section>
    );
  }
}

export default ChannelTile;
