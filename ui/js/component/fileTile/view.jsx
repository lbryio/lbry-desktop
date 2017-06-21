import React from "react";
import lbry from "lbry.js";
import lbryuri from "lbryuri.js";
import Link from "component/link";
import FileActions from "component/fileActions";
import {
  Thumbnail,
  TruncatedText,
  TruncatedMarkdown,
} from "component/common.js";
import FilePrice from "component/filePrice";
import UriIndicator from "component/uriIndicator";

class FileTile extends React.PureComponent {
  static SHOW_EMPTY_PUBLISH = "publish";
  static SHOW_EMPTY_PENDING = "pending";

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
      metadata,
      isResolvingUri,
      showEmpty,
      navigate,
      hidePrice,
    } = this.props;

    const uri = lbryuri.normalize(this.props.uri);
    const isClaimed = !!claim;
    const isClaimable = lbryuri.isClaimable(uri);
    const title = isClaimed && metadata && metadata.title
      ? metadata.title
      : uri;
    const obscureNsfw = this.props.obscureNsfw && metadata && metadata.nsfw;
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
        <Link onClick={onClick} className="card__link">
          <div className={"card__inner file-tile__row"}>
            <div
              className="card__media"
              style={{
                backgroundImage:
                  "url('" +
                    (metadata && metadata.thumbnail
                      ? metadata.thumbnail
                      : lbry.imagePath("default-thumb.svg")) +
                    "')",
              }}
            />
            <div className="file-tile__content">
              <div className="card__title-primary">
                {!hidePrice ? <FilePrice uri={this.props.uri} /> : null}
                <div className="meta">{uri}</div>
                <h3><TruncatedText lines={1}>{title}</TruncatedText></h3>
              </div>
              <div className="card__content card__subtext">
                <TruncatedMarkdown lines={3}>
                  {description}
                </TruncatedMarkdown>
              </div>
            </div>
          </div>
        </Link>
        {this.state.showNsfwHelp
          ? <div className="card-overlay">
              <p>
                {__(
                  "This content is Not Safe For Work. To view adult content, please change your"
                )}
                {" "}
                <Link
                  className="button-text"
                  onClick={() => navigate("/settings")}
                  label={__("Settings")}
                />.
              </p>
            </div>
          : null}
      </section>
    );
  }
}

export default FileTile;
