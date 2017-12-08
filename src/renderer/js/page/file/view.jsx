import React from "react";
import lbry from "lbry.js";
import lbryuri from "lbryuri.js";
import Media from "component/media";
import { Thumbnail } from "component/common";
import FilePrice from "component/filePrice";
import FileDetails from "component/fileDetails";
import UriIndicator from "component/uriIndicator";
import Icon from "component/icon";
import WalletSendTip from "component/walletSendTip";
import DateTime from "component/dateTime";
import * as icons from "constants/icons";

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
    } = this.props;

    const showTipBox = tab == "tip";

    if (!claim || !metadata) {
      return (
        <span className="empty">{__("Empty claim or metadata info.")}</span>
      );
    }

    const { height } = claim;
    const title = metadata.title;
    const isRewardContent = rewardedContentClaimIds.includes(claim.claim_id);
    const mediaType = lbry.getMediaType(contentType);
    const player = require("render-media");
    const obscureNsfw = this.props.obscureNsfw && metadata && metadata.nsfw;
    const isPlayable =
      Object.values(player.mime).indexOf(contentType) !== -1 ||
      mediaType === "audio";

    return (
      <section className={"card " + (obscureNsfw ? "card--obscured " : "")}>
        <div className="show-page-media">
          {isPlayable ? (
            <Media className="media-embedded" uri={uri} overlay={false} />
          ) : metadata && metadata.thumbnail ? (
            <Thumbnail src={metadata.thumbnail} />
          ) : (
            <Thumbnail />
          )}
        </div>
        <div className="card__inner">
          {(!tab || tab === "details") && (
            <div>
              {" "}
              <div className="card__title-identity">
                {!fileInfo || fileInfo.written_bytes <= 0 ? (
                  <span style={{ float: "right" }}>
                    <FilePrice uri={lbryuri.normalize(uri)} />
                    {isRewardContent && (
                      <span>
                        {" "}
                        <Icon icon={icons.FEATURED} />
                      </span>
                    )}
                  </span>
                ) : null}
                <h1>{title}</h1>
                <div className="card__subtitle card--file-subtitle">
                  <UriIndicator uri={uri} link={true} />
                  <span className="card__publish-date">
                    Published on{" "}
                    <DateTime block={height} show={DateTime.SHOW_DATE} />
                  </span>
                </div>
              </div>
              <FileDetails uri={uri} />
            </div>
          )}
          {tab === "tip" && (
            <WalletSendTip claim_id={claim.claim_id} uri={uri} />
          )}
        </div>
      </section>
    );
  }
}

export default FilePage;
