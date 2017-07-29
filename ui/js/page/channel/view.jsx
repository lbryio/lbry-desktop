import React from "react";
import lbryuri from "lbryuri";
import { BusyMessage } from "component/common";
import FileTile from "component/fileTile";
import Link from "component/link";
import ReactPaginate from "react-paginate";

class ChannelPage extends React.PureComponent {
  componentDidMount() {
    const { uri, params, fetchClaims } = this.props;

    fetchClaims(uri, params.page || 1);
  }

  componentWillReceiveProps(nextProps) {
    const { params, fetching, fetchClaims } = this.props;
    const nextParams = nextProps.params;

    if (fetching !== nextParams.page && params.page !== nextParams.page)
      fetchClaims(nextProps.uri, nextParams.page);
  }

  changePage(pageNumber) {
    const { params, currentPage } = this.props;
    const newParams = Object.assign({}, params, { page: pageNumber });

    this.props.navigate("/show", newParams);
  }

  render() {
    const {
      fetching,
      claimsInChannel,
      claim,
      uri,
      params,
      totalPages,
    } = this.props;
    const { page } = params;

    let contentList;
    if (claimsInChannel === undefined) {
      contentList = <BusyMessage message={__("Fetching content")} />;
    } else if (claimsInChannel) {
      contentList = claimsInChannel.length
        ? claimsInChannel.map(claim =>
            <FileTile
              key={claim.claim_id}
              uri={lbryuri.build({
                name: claim.name,
                claimId: claim.claim_id,
              })}
            />
          )
        : <span className="empty">{__("No content found.")}</span>;
    }

    return (
      <div>
        <section className="card">
          <div className="card__inner">
            <div className="card__title-identity"><h1>{uri}</h1></div>
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
          totalPages > 1 &&
          <ReactPaginate
            pageCount={totalPages}
            pageRangeDisplayed={2}
            previousLabel="‹"
            nextLabel="›"
            activeClassName="pagination__item--selected"
            pageClassName="pagination__item"
            previousClassName="pagination__item pagination__item--previous"
            nextClassName="pagination__item pagination__item--next"
            marginPagesDisplayed={2}
            onPageChange={e => this.changePage(e.selected + 1)}
            initialPage={parseInt(page - 1)}
            containerClassName="pagination"
          />}
      </div>
    );
  }
}

export default ChannelPage;
