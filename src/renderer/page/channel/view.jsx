import React from "react";
import lbryuri from "lbryuri";
import { BusyMessage } from "component/common";
import FileTile from "component/fileTile";
import ReactPaginate from "react-paginate";
import Link from "component/link";
import SubscribeButton from "component/subscribeButton";

class ChannelPage extends React.PureComponent {
  componentDidMount() {
    const { uri, page, fetchClaims, fetchClaimCount } = this.props;

    fetchClaims(uri, page || 1);
    fetchClaimCount(uri);
  }

  componentWillReceiveProps(nextProps) {
    const { page, uri, fetching, fetchClaims, fetchClaimCount } = this.props;

    if (nextProps.page && page !== nextProps.page) {
      fetchClaims(nextProps.uri, nextProps.page);
    }
    if (nextProps.uri != uri) {
      fetchClaimCount(uri);
    }
  }

  changePage(pageNumber) {
    const { params } = this.props;
    const newParams = Object.assign({}, params, { page: pageNumber });

    this.props.navigate("/show", newParams);
  }

  render() {
    const {
      fetching,
      claimsInChannel,
      claim,
      uri,
      page,
      totalPages,
      doChannelSubscribe,
      doChannelUnsubscribe,
      subscriptions,
    } = this.props;

    const { name, claim_id: claimId } = claim;
    const subscriptionUri = lbryuri.build(
      { channelName: name, claimId },
      false
    );

    let contentList;
    if (fetching) {
      contentList = <BusyMessage message={__("Fetching content")} />;
    } else {
      contentList =
        claimsInChannel && claimsInChannel.length ? (
          claimsInChannel.map(claim => (
            <FileTile
              key={claim.claim_id}
              uri={lbryuri.build({
                name: claim.name,
                claimId: claim.claim_id,
              })}
              showLocal={true}
            />
          ))
        ) : (
          <span className="empty">{__("No content found.")}</span>
        );
    }

    return (
      <div>
        <section className="card">
          <div className="card__inner">
            <div className="card__title-identity">
              <h1>{uri}</h1>
            </div>
            <SubscribeButton uri={uri} channelName={name} />
          </div>
          <div className="card__content">
            <p className="empty">
              {__(
                "Channel pages are empty for all publishers currently, but will be coming in a future update."
              )}
            </p>
          </div>
        </section>
        <h3 className="card-row__header">{__("Published Content")}</h3>
        {contentList}
        <div />
        {(!fetching || (claimsInChannel && claimsInChannel.length)) &&
          totalPages > 1 && (
            <ReactPaginate
              pageCount={totalPages}
              pageRangeDisplayed={2}
              previousLabel="‹"
              nextLabel="›"
              activeClassName="pagination__item--selected"
              pageClassName="pagination__item"
              previousClassName="pagination__item pagination__item--previous"
              nextClassName="pagination__item pagination__item--next"
              breakClassName="pagination__item pagination__item--break"
              marginPagesDisplayed={2}
              onPageChange={e => this.changePage(e.selected + 1)}
              initialPage={parseInt(page - 1)}
              containerClassName="pagination"
            />
          )}
      </div>
    );
  }
}

export default ChannelPage;
