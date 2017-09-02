import React from "react";
import ReactMarkdown from "react-markdown";
import lbry from "lbry.js";
import lbryuri from "lbryuri.js";
import Video from "component/video";
import TipLink from "component/tipLink";
import { Thumbnail } from "component/common";
import FilePrice from "component/filePrice";
import FileActions from "component/fileActions";
import Link from "component/link";
import UriIndicator from "component/uriIndicator";
import IconFeatured from "component/iconFeatured";

const FormatItem = props => {
  const { contentType, metadata: { language, license } } = props;

  const mediaType = lbry.getMediaType(contentType);

  return (
    <table className="table-standard">
      <tbody>
        <tr>
          <td>{__("Content-Type")}</td><td>{mediaType}</td>
        </tr>
        <tr>
          <td>{__("Language")}</td><td>{language}</td>
        </tr>
        <tr>
          <td>{__("License")}</td><td>{license}</td>
        </tr>
      </tbody>
    </table>
  );
};

class FilePage extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      showTipBox: false,
    };
  }

  componentDidMount() {
    this.fetchFileInfo(this.props);
    this.fetchCostInfo(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.fetchFileInfo(nextProps);
  }

  fetchFileInfo(props) {
    if (props.fileInfo === undefined) {
      props.fetchFileInfo(props.uri);
    }
  }

  fetchCostInfo(props) {
    if (props.costInfo === undefined) {
      props.fetchCostInfo(props.uri);
    }
  }

  handleTipShow() {
    this.setState({
      showTipBox: true,
    });
  }

  handleTipHide() {
    this.setState({
      showTipBox: false,
    });
  }

  render() {
    const {
      claim,
      fileInfo,
      metadata,
      contentType,
      uri,
      rewardedContentClaimIds,
    } = this.props;

    const { showTipBox } = this.state;

    if (!claim || !metadata) {
      return (
        <span className="empty">{__("Empty claim or metadata info.")}</span>
      );
    }

    const {
      txid,
      nout,
      channel_name: channelName,
      has_signature: hasSignature,
      signature_is_valid: signatureIsValid,
      value,
    } = claim;

    const outpoint = txid + ":" + nout;
    const title = metadata.title;
    const channelClaimId = claim.value && claim.value.publisherSignature
      ? claim.value.publisherSignature.certificateId
      : null;
    const channelUri = signatureIsValid && hasSignature && channelName
      ? lbryuri.build({ channelName, claimId: channelClaimId }, false)
      : null;
    const uriIndicator = <UriIndicator uri={uri} />;
    const isRewardContent = rewardedContentClaimIds.includes(claim.claim_id);
    const mediaType = lbry.getMediaType(contentType);
    const player = require("render-media");
    const obscureNsfw = this.props.obscureNsfw && metadata && metadata.nsfw;
    const isPlayable =
      Object.values(player.mime).indexOf(contentType) !== -1 ||
      mediaType === "audio";

    return (
      <main className="main--single-column">
        <section className="show-page-media">
          {isPlayable
            ? <Video className="video-embedded" uri={uri} />
            : metadata && metadata.thumbnail
              ? <Thumbnail src={metadata.thumbnail} />
              : <Thumbnail />}
        </section>
        <section className={"card " + (obscureNsfw ? "card--obscured " : "")}>
          <div className="card__inner">
            <div className="card__title-identity">
              {!fileInfo || fileInfo.written_bytes <= 0
                ? <span style={{ float: "right" }}>
                    <FilePrice uri={lbryuri.normalize(uri)} />
                    {isRewardContent && <span>{" "}<IconFeatured /></span>}
                  </span>
                : null}
              <h1>{title}</h1>
              <div className="card__subtitle">
                {channelUri
                  ? <Link
                      onClick={() =>
                        this.props.navigate("/show", { uri: channelUri })}
                    >
                      {uriIndicator}
                    </Link>
                  : uriIndicator}
              </div>
              <div className="card__actions">
                <FileActions
                  uri={uri}
                  onTipShow={this.handleTipShow.bind(this)}
                />
              </div>
            </div>
            <div className="card__content card__subtext card__subtext card__subtext--allow-newlines">
              <ReactMarkdown
                source={(metadata && metadata.description) || ""}
                escapeHtml={true}
                disallowedTypes={["Heading", "HtmlInline", "HtmlBlock"]}
              />
            </div>
          </div>
          {metadata && !showTipBox
            ? <div className="card__content">
                <FormatItem metadata={metadata} contentType={contentType} />
              </div>
            : ""}
          {showTipBox
            ? <TipLink
                onTipShow={this.handleTipShow.bind(this)}
                onTipHide={this.handleTipHide.bind(this)}
                claim_id={claim.claim_id}
              />
            : ""}
          <div className="card__content">
            <Link
              href={`https://lbry.io/dmca?claim_id=${claim.claim_id}`}
              label={__("report")}
              className="button-text-help"
            />
          </div>
        </section>
      </main>
    );
  }
}

export default FilePage;
