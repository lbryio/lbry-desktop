// @flow
import React from 'react';
import BusyIndicator from 'component/common/busy-indicator';
import { FormField, FormRow } from 'component/common/form';
import ReactPaginate from 'react-paginate';
import SubscribeButton from 'component/subscribeButton';
import ViewOnWebButton from 'component/viewOnWebButton';
import Page from 'component/page';
import FileList from 'component/fileList';
import HiddenNsfwClaims from 'component/hiddenNsfwClaims';
import type { Claim } from 'types/claim';

type Props = {
  uri: string,
  page: number,
  totalPages: number,
  fetching: boolean,
  params: { page: number },
  claim: Claim,
  claimsInChannel: Array<Claim>,
  channelIsMine: boolean,
  fetchClaims: (string, number) => void,
  fetchClaimCount: string => void,
  navigate: (string, {}) => void,
};

class ChannelPage extends React.PureComponent<Props> {
  componentDidMount() {
    const { uri, page, fetchClaims, fetchClaimCount } = this.props;

    fetchClaims(uri, page || 1);
    fetchClaimCount(uri);
  }

  componentWillReceiveProps(nextProps: Props) {
    const { page, uri, fetchClaims, fetchClaimCount } = this.props;

    if (nextProps.page && page !== nextProps.page) {
      fetchClaims(nextProps.uri, nextProps.page);
    }
    if (nextProps.uri !== uri) {
      fetchClaimCount(uri);
    }
  }

  changePage(pageNumber: number) {
    const { params } = this.props;
    const newParams = Object.assign({}, params, { page: pageNumber });

    this.props.navigate('/show', newParams);
  }

  paginate(e: SyntheticKeyboardEvent<*>, totalPages: number) {
    // Change page if enter was pressed, and the given page is between
    // the first and the last.
    const pageFromInput = Number(e.currentTarget.value);

    if (
      pageFromInput &&
      e.keyCode === 13 &&
      !Number.isNaN(pageFromInput) &&
      pageFromInput > 0 &&
      pageFromInput <= totalPages
    ) {
      this.changePage(pageFromInput);
    }
  }

  render() {
    const { uri, fetching, claimsInChannel, claim, page, totalPages, channelIsMine } = this.props;
    const { name, permanent_url: permanentUrl, claim_id: claimId } = claim;
    const currentPage = parseInt((page || 1) - 1, 10);

    const contentList =
      claimsInChannel && claimsInChannel.length ? (
        <FileList sortByHeight hideFilter fileInfos={claimsInChannel} />
      ) : (
        !fetching && <span className="empty">{__('No content found.')}</span>
      );

    return (
      <Page notContained>
        <section className="card__channel-info card__channel-info--large">
          <h1>
            {name}
            {fetching && <BusyIndicator />}
          </h1>
          <div className="card__actions card__actions--no-margin">
            <SubscribeButton uri={permanentUrl} channelName={name} />
            <ViewOnWebButton claimId={claimId} claimName={name} />
          </div>
        </section>
        <section>{contentList}</section>
        {(!fetching || (claimsInChannel && claimsInChannel.length)) &&
          totalPages > 1 && (
            <FormRow verticallyCentered centered>
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
                forcePage={currentPage}
                initialPage={currentPage}
                containerClassName="pagination"
              />

              <FormField
                className="paginate-channel"
                onKeyUp={e => this.paginate(e, totalPages)}
                prefix={__('Go to page:')}
                type="text"
              />
            </FormRow>
          )}
        {!channelIsMine && <HiddenNsfwClaims className="card__content help" uri={uri} />}
      </Page>
    );
  }
}

export default ChannelPage;
