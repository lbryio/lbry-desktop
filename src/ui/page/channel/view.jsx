// @flow
import type { Claim } from 'types/claim';
import type { UrlLocation } from 'types/location';
import * as icons from 'constants/icons';
import * as MODALS from 'constants/modal_types';
import React, { useEffect } from 'react';
import BusyIndicator from 'component/common/busy-indicator';
import { FormField, Form } from 'component/common/form';
import ReactPaginate from 'react-paginate';
import SubscribeButton from 'component/subscribeButton';
import Page from 'component/page';
import FileList from 'component/fileList';
import HiddenNsfwClaims from 'component/hiddenNsfwClaims';
import Button from 'component/button';
import { withRouter } from 'react-router-dom';

type Props = {
  uri: string,
  totalPages: number,
  fetching: boolean,
  params: { page: number },
  claim: Claim,
  claimsInChannel: Array<Claim>,
  channelIsMine: boolean,
  fetchClaims: (string, number) => void,
  history: { push: string => void },
  openModal: (id: string, { uri: string }) => void,
  location: UrlLocation,
};

function ChannelPage(props: Props) {
  const {
    uri,
    fetching,
    claimsInChannel,
    claim,
    totalPages,
    channelIsMine,
    openModal,
    fetchClaims,
    location,
    history,
  } = props;

  const { name, permanent_url: permanentUrl } = claim;
  const { search } = location;
  const urlParams = new URLSearchParams(search);
  const page = Number(urlParams.get('page')) || 1;

  useEffect(() => {
    // Fetch new claims if the channel or page number changes
    fetchClaims(uri, page);
  }, [uri, page]);

  const changePage = (pageNumber: number) => {
    if (!page && pageNumber === 1) {
      return;
    }

    history.push(`?page=${pageNumber}`);
  };

  const paginate = (e: SyntheticKeyboardEvent<*>) => {
    // Change page if enter was pressed, and the given page is between the first and the last page
    const pageFromInput = Number(e.currentTarget.value);

    if (
      pageFromInput &&
      e.keyCode === 13 &&
      !Number.isNaN(pageFromInput) &&
      pageFromInput > 0 &&
      pageFromInput <= totalPages
    ) {
      changePage(pageFromInput);
    }
  };

  return (
    <Page notContained>
      <header className="channel-info">
        <h1 className="media__title media__title--large">
          {name}
          {fetching && <BusyIndicator />}
        </h1>
        <span>{`lbry://${permanentUrl}`}</span>

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

      <section className="media-group--list">
        {claimsInChannel && claimsInChannel.length ? (
          <FileList sortByHeight hideFilter fileInfos={claimsInChannel} />
        ) : (
          !fetching && <span className="empty">{__('No content found.')}</span>
        )}
      </section>

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
                onPageChange={e => changePage(e.selected + 1)}
                forcePage={page - 1}
                initialPage={page - 1}
                disableInitialCallback
                containerClassName="pagination"
              />
            </fieldset-section>

            <FormField
              className="paginate-channel"
              onKeyUp={e => paginate(e)}
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

export default withRouter(ChannelPage);
