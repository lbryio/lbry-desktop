import React from "react";
import * as icons from "constants/icons";
import lbryuri from "lbryuri.js";
import CardMedia from "component/cardMedia";
import { TruncatedText } from "component/common.js";
import FilePrice from "component/filePrice";
import NsfwOverlay from "component/nsfwOverlay";
import Icon from "component/icon";

class FileTile extends React.PureComponent {
  static SHOW_EMPTY_PUBLISH = "publish";
  static SHOW_EMPTY_PENDING = "pending";

  static defaultProps = {
    showPrice: true,
    showLocal: true,
  };

  constructor(props) {
    super(props);
    this.state = {
      showNsfwHelp: false,
    };
  }

  componentDidMount() {
    const { isResolvingUri, claim, uri, resolveUri } = this.props;

    if (!isResolvingUri && !claim && uri) resolveUri(uri);
  }

  componentWillReceiveProps(nextProps) {
    const { isResolvingUri, claim, uri, resolveUri } = this.props;

    if (!isResolvingUri && claim === undefined && uri) resolveUri(uri);
  }

  handleMouseOver() {
    if (
      this.props.obscureNsfw &&
      this.props.metadata &&
      this.props.metadata.nsfw
    ) {
      this.setState({
        showNsfwHelp: true,
      });
    }
  }

  handleMouseOut() {
    if (this.state.showNsfwHelp) {
      this.setState({
        showNsfwHelp: false,
      });
    }
  }

  render() {
    const {
      claim,
      showActions,
      metadata,
      isResolvingUri,
      showEmpty,
      navigate,
      showPrice,
      showLocal,
      rewardedContentClaimIds,
      fileInfo,
    } = this.props;

    const uri = lbryuri.normalize(this.props.uri);
    const isClaimed = !!claim;
    const isClaimable = lbryuri.isClaimable(uri);
    const title = isClaimed && metadata && metadata.title
      ? metadata.title
      : lbryuri.parse(uri).contentName;
    const thumbnail = metadata && metadata.thumbnail
      ? metadata.thumbnail
      : null;
    const obscureNsfw = this.props.obscureNsfw && metadata && metadata.nsfw;
    const isRewardContent =
      claim && rewardedContentClaimIds.includes(claim.claim_id);

    let onClick = () => navigate("/show", { uri });

    let description = "";
    if (isClaimed) {
      description = metadata && metadata.description;
    } else if (isResolvingUri) {
      description = __("Loading...");
    } else if (showEmpty === FileTile.SHOW_EMPTY_PUBLISH) {
      onClick = () => navigate("/publish", {});
      description = (
        <span className="empty">
          {__("This location is unused.")} {" "}
          {isClaimable &&
            <span className="button-text">{__("Put something here!")}</span>}
        </span>
      );
    } else if (showEmpty === FileTile.SHOW_EMPTY_PENDING) {
      description = (
        <span className="empty">
          {__("This file is pending confirmation.")}
        </span>
      );
    }

    return (
      <section
        className={"file-tile card " + (obscureNsfw ? "card--obscured " : "")}
        onMouseEnter={this.handleMouseOver.bind(this)}
        onMouseLeave={this.handleMouseOut.bind(this)}
      >
        <div onClick={onClick} className="card__link">
          <div className={"card__inner file-tile__row"}>
            <CardMedia title={title} thumbnail={thumbnail} />
            <div className="file-tile__content">
              <div className="card__title-primary">
                <span className="card__indicators">
                  {showPrice && <FilePrice uri={this.props.uri} />}
                  {" "}
                  {isRewardContent && <Icon icon={icons.FEATURED} />}
                  {" "}
                  {showLocal && fileInfo && <Icon icon={icons.LOCAL} />}
                </span>
                <div className="meta">{uri}</div>
                <h3>
                  <TruncatedText lines={1}>{title}</TruncatedText>
                </h3>
              </div>
              {description &&
                <div className="card__content card__subtext">
                  <TruncatedText lines={!showActions ? 4 : 2}>
                    {description}
                  </TruncatedText>
                </div>}
            </div>
          </div>
        </div>
        {this.state.showNsfwHelp && <NsfwOverlay />}
      </section>
    );
  }
}

export default FileTile;
