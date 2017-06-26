import React from "react";
import lbryuri from "lbryuri";
import { BusyMessage } from "component/common";
import ChannelPage from "page/channel";
import FilePage from "page/filePage";

class ShowPage extends React.PureComponent {
  componentWillMount() {
    const { isResolvingUri, resolveUri, uri } = this.props;

    if (!isResolvingUri) resolveUri(uri);
  }

  componentWillReceiveProps(nextProps) {
    const { isResolvingUri, resolveUri, claim, uri } = nextProps;

    if (!isResolvingUri && claim === undefined && uri) {
      resolveUri(uri);
    }
  }

  render() {
    const { claim, uri, isResolvingUri } = this.props;

    let innerContent = "";

    if (isResolvingUri && !claim) {
      innerContent = (
        <section className="card">
          <div className="card__inner">
            <div className="card__title-identity"><h1>{uri}</h1></div>
          </div>
          <div className="card__content">
            {isResolvingUri &&
              <BusyMessage
                message={__("Loading magic decentralized data...")}
              />}
            {claim === null &&
              <span className="empty">
                {__("There's nothing at this location.")}
              </span>}
          </div>
        </section>
      );
    } else if (claim && claim.name.length && claim.name[0] === "@") {
      innerContent = <ChannelPage uri={uri} />;
    } else if (claim) {
      innerContent = <FilePage uri={uri} />;
    }

    return <main className="main--single-column">{innerContent}</main>;
  }
}

export default ShowPage;
