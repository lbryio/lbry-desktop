// @flow
import type { Claim } from 'types/claim';
import * as icons from 'constants/icons';
import * as MODALS from 'constants/modal_types';
import React from 'react';
import BusyIndicator from 'component/common/busy-indicator';
import { FormField, Form } from 'component/common/form';
import ReactPaginate from 'react-paginate';
import SubscribeButton from 'component/subscribeButton';
import Page from 'component/page';
import FileList from 'component/fileList';
import HiddenNsfwClaims from 'component/hiddenNsfwClaims';
import Button from 'component/button';

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
  navigate: (string, {}) => void,
  openModal: (id: string, { uri: string }) => void,
};

class ChannelPage extends React.PureComponent<Props> {
  componentDidMount() {
    const { uri, page, fetchClaims } = this.props;
    fetchClaims(uri, page || 1);
  }

  componentDidUpdate(prevProps: Props) {
    const { page, fetchClaims, uri } = this.props;

    if (prevProps.page && prevProps.page && page !== prevProps.page) {
      fetchClaims(uri, page);
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
    const {
      uri,
      fetching,
      claimsInChannel,
      claim,
      page,
      totalPages,
      channelIsMine,
      openModal,
    } = this.props;
    const { name, permanent_url: permanentUrl } = claim;
    const currentPage = parseInt((page || 1) - 1, 10);
    const contentList =
      claimsInChannel && claimsInChannel.length ? (
        <FileList sortByHeight hideFilter fileInfos={claimsInChannel} />
      ) : (
        !fetching && <span className="empty">{__('No content found.')}</span>
      );

    return (
      <Page notContained>
        <header className="channel-info">
          <h1 className="media__title media__title--large">
            {name}
            {fetching && <BusyIndicator />}
          </h1>

          <div className="channel-info__actions__group">
            <SubscribeButton uri={`lbry://${permanentUrl}`} channelName={name} />
            <Button
              button="alt"
              icon={icons.SHARE}
              label={__('Share Channel')}
              onClick={() =>
                openModal(MODALS.SOCIAL_SHARE, { uri, speechShareable: true, isChannel: true })
              }
            />
          </div>
        </header>

        <section className="media-group--list">{contentList}</section>

        {(!fetching || (claimsInChannel && claimsInChannel.length)) && totalPages > 1 && (
          <Form>
            <fieldset-group class="fieldset-group--smushed fieldgroup--paginate">
              <fieldset-section>
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
              </fieldset-section>

              <FormField
                className="paginate-channel"
                onKeyUp={e => this.paginate(e, totalPages)}
                label={__('Go to page:')}
                type="text"
                name="paginate-file"
              />
            </fieldset-group>
          </Form>
        )}

        {!channelIsMine && <HiddenNsfwClaims className="card__content help" uri={uri} />}
      </Page>
    );
  }
}

export default ChannelPage;
