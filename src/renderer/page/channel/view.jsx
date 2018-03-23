// @flow
import React from 'react';
import { buildURI, parseURI } from 'lbryURI';
import BusyIndicator from 'component/common/busy-indicator';
import FileTile from 'component/fileTile';
import ReactPaginate from 'react-paginate';
import Button from 'component/button';
import SubscribeButton from 'component/subscribeButton';
import Page from 'component/page';
import FileList from 'component/fileList';
import * as modals from 'constants/modal_types';

type Props = {
  uri: string,
  page: number,
  totalPages: number,
  fetching: boolean,
  params: { page: number },
  claim: {
    name: string,
    claim_id: string,
  },
  claimsInChannel: Array<{}>,
  fetchClaims: (string, number) => void,
  fetchClaimCount: string => void,
  navigate: (string, {}) => void,
  doChannelSubscribe: string => void,
  doChannelUnsubscribe: string => void,
  openModal: (string, {}) => void,
};

class ChannelPage extends React.PureComponent<Props> {
  componentDidMount() {
    const { uri, page, fetchClaims, fetchClaimCount } = this.props;

    fetchClaims(uri, page || 1);
    fetchClaimCount(uri);
  }

  componentWillReceiveProps(nextProps: Props) {
    const { page, uri, fetching, fetchClaims, fetchClaimCount } = this.props;

    if (nextProps.page && page !== nextProps.page) {
      fetchClaims(nextProps.uri, nextProps.page);
    }
    if (nextProps.uri != uri) {
      fetchClaimCount(uri);
    }
  }

  changePage(pageNumber: number) {
    const { params } = this.props;
    const newParams = Object.assign({}, params, { page: pageNumber });

    this.props.navigate('/show', newParams);
  }

  render() {
    const { fetching, claimsInChannel, claim, uri, page, totalPages, openModal } = this.props;
    const { name, claim_id: claimId } = claim;
    const subscriptionUri = buildURI({ channelName: name, claimId }, false);

    let contentList;
    if (fetching) {
      contentList = <BusyIndicator message={__('Fetching content')} />;
    } else {
      contentList =
        claimsInChannel && claimsInChannel.length ? (
          <FileList hideFilter fileInfos={claimsInChannel} />
        ) : (
          <span className="empty">{__('No content found.')}</span>
        );
    }

    return (
      <Page notContained>
        <section className="card__channel-info card__channel-info--large">
          <h1>{name}</h1>
          <div className="card__actions card__actions--no-margin">
            <Button
              button="alt"
              iconRight="Send"
              label={__('Enjoy this? Send a tip')}
              onClick={() => openModal(modals.SEND_TIP, { uri })}
            />
            <SubscribeButton uri={uri} channelName={name} />
          </div>
        </section>
        <section>{contentList}</section>
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
      </Page>
    );
  }
}

export default ChannelPage;
