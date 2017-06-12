import React from "react";
import lbryuri from "lbryuri";
import { BusyMessage } from "component/common";
import FileTile from "component/fileTile";

class ChannelPage extends React.PureComponent {
  componentDidMount() {
    this.fetchClaims(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.fetchClaims(nextProps);
  }

  fetchClaims(props) {
    if (props.claimsInChannel === undefined) {
      props.fetchClaims(props.uri);
    }
  }

  render() {
    const { claimsInChannel, claim, uri } = this.props;

    let contentList;
    if (claimsInChannel === undefined) {
      contentList = <BusyMessage message={__("Fetching content")} />;
    } else if (claimsInChannel) {
      contentList = claimsInChannel.length
        ? claimsInChannel.map(claim =>
            <FileTile
              key={claim.claim_id}
              uri={lbryuri.build({ name: claim.name, claimId: claim.claim_id })}
            />
          )
        : <span className="empty">{__("No content found.")}</span>;
    }

    return (
      <main className="main--single-column">
        <section className="card">
          <div className="card__inner">
            <div className="card__title-identity"><h1>{uri}</h1></div>
          </div>
          <div className="card__content">
            <p>
              {__("This channel page is a stub.")}
            </p>
          </div>
        </section>
        <h3 className="card-row__header">{__("Published Content")}</h3>
        {contentList}
      </main>
    );
  }
}

export default ChannelPage;
