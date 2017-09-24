import React from "react";
import lbry from "lbry.js";
import lbryuri from "lbryuri.js";
import Video from "component/video";
import { Thumbnail, Icon } from "component/common";
import FilePrice from "component/filePrice";
import FileDetails from "component/fileDetails";
import UriIndicator from "component/uriIndicator";
import IconFeatured from "component/iconFeatured";
import WalletSendTip from "component/walletSendTip";

class FilePage extends React.PureComponent {
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

  render() {
    const {
      claim,
      fileInfo,
      metadata,
      contentType,
      tab,
      uri,
      rewardedContentClaimIds,
      expanded,
      navigate,
      closeOverlayMedia,
    } = this.props;

    const showTipBox = tab == "tip";

    if (!claim || !metadata) {
      return (
        <span className="empty">{__("Empty claim or metadata info.")}</span>
      );
    }

    const title = metadata.title;
    const isRewardContent = rewardedContentClaimIds.includes(claim.claim_id);
    const mediaType = lbry.getMediaType(contentType);
    const player = require("render-media");
    const obscureNsfw = this.props.obscureNsfw && metadata && metadata.nsfw;
    const isPlayable =
      Object.values(player.mime).indexOf(contentType) !== -1 ||
      mediaType === "audio";

    const CloseButton = (
      <div className="button-close" onClick={() => closeOverlayMedia()}>
        <Icon icon="icon-times" />
      </div>
    );

    const ShowThumbnail = metadata && metadata.thumbnail
      ? <Thumbnail src={metadata.thumbnail} />
      : <Thumbnail />;

    const ShowPlayer = (
      <div className="player" onClick={() => navigate("/show", { uri })}>
        <Video className="video-embedded" uri={uri} />
      </div>
    );

    return (
      <div>
        <section className="show-page-media">
          {isPlayable ? ShowPlayer : ShowThumbnail}
          {!expanded && CloseButton}
        </section>
        <section
          className={
            "show-page-info card " + (obscureNsfw ? "card--obscured " : "")
          }
        >
          <div className="card__inner">
            {(!tab || tab === "details") &&
              <div>
                {" "}          {" "}
                <div className="card__title-identity">
                  {!fileInfo || fileInfo.written_bytes <= 0
                    ? <span style={{ float: "right" }}>
                        <FilePrice uri={lbryuri.normalize(uri)} />
                        {isRewardContent && <span>{" "}<IconFeatured /></span>}
                      </span>
                    : null}
                  <h1>{title}</h1>
                  <div className="card__subtitle">
                    <UriIndicator uri={uri} link={true} />
                  </div>
                </div>
                <FileDetails uri={uri} />
              </div>}
            {tab === "tip" &&
              <WalletSendTip claim_id={claim.claim_id} uri={uri} />}
          </div>
        </section>
      </div>
    );
  }
}

export default FilePage;
