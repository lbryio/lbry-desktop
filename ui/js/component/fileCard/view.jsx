import React from "react";
import lbry from "lbry.js";
import lbryuri from "lbryuri.js";
import Link from "component/link";
import {
  Thumbnail,
  TruncatedText,
  Icon,
  TruncatedMarkdown,
} from "component/common";
import FilePrice from "component/filePrice";
import UriIndicator from "component/uriIndicator";

class FileCard extends React.PureComponent {
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

  handleMouseOver() {
    this.setState({
      hovered: true,
    });
  }

  handleMouseOut() {
    this.setState({
      hovered: false,
    });
  }

  render() {
    const { claim, fileInfo, metadata, isResolvingUri, navigate } = this.props;

    const uri = lbryuri.normalize(this.props.uri);
    const title = metadata && metadata.title ? metadata.title : uri;
    const obscureNsfw = this.props.obscureNsfw && metadata && metadata.nsfw;

    let description = "";
    if (isResolvingUri && !claim) {
      description = __("Loading...");
    } else if (metadata && metadata.description) {
      description = metadata.description;
    } else if (claim === null) {
      description = __("This address contains no content.");
    }

    return (
      <section
        className={
          "card card--small card--link " +
          (obscureNsfw ? "card--obscured " : "")
        }
        onMouseEnter={this.handleMouseOver.bind(this)}
        onMouseLeave={this.handleMouseOut.bind(this)}
      >
        <div className="card__inner">
          <Link
            onClick={() => navigate("/show", { uri })}
            className="card__link"
          >
            <div className="card__title-identity">
              <h5 title={title}>
                <TruncatedText lines={1}>{title}</TruncatedText>
              </h5>
              <div className="card__subtitle">
                <span style={{ float: "right" }}>
                  <FilePrice uri={uri} />
                  {fileInfo
                    ? <span>{" "}<Icon fixed icon="icon-folder" /></span>
                    : ""}
                </span>
                <UriIndicator uri={uri} />
              </div>
            </div>
            {metadata &&
              metadata.thumbnail &&
              <div
                className="card__media"
                style={{ backgroundImage: "url('" + metadata.thumbnail + "')" }}
              />}
            <div className="card__content card__subtext card__subtext--two-lines">
              <TruncatedMarkdown lines={2}>{description}</TruncatedMarkdown>
            </div>
          </Link>
          {obscureNsfw && this.state.hovered
            ? <div className="card-overlay">
                <p>
                  {__(
                    "This content is Not Safe For Work. To view adult content, please change your"
                  )}
                  {" "}
                  <Link
                    className="button-text"
                    onClick={() => navigate("settings")}
                    label={__("Settings")}
                  />.
                </p>
              </div>
            : null}
        </div>
      </section>
    );
  }
}

export default FileCard;
