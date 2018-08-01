// @flow
import React from 'react';
import FileCard from 'component/fileCard';
import Page from 'component/page';
import Button from 'component/button';
import { FormField, FormRow } from 'component/common/form';
import ReactPaginate from 'react-paginate';

type HistoryItem = {
  uri: string,
  lastViewed: number,
};

type Props = {
  history: Array<HistoryItem>,
  page: number,
  pageCount: number,
  navigate: string => void,
  params: { page: number },
};

class UserHistoryPage extends React.PureComponent<Props> {
  changePage(pageNumber: number) {
    const { params } = this.props;
    const newParams = { ...params, page: pageNumber };
    this.props.navigate('/user_history', newParams);
  }

  paginate(e: SyntheticKeyboardEvent<*>) {
    const pageFromInput = Number(e.currentTarget.value);
    if (
      pageFromInput &&
      e.keyCode === 13 &&
      !Number.isNaN(pageFromInput) &&
      pageFromInput > 0 &&
      pageFromInput <= this.props.pageCount
    ) {
      this.changePage(pageFromInput);
    }
  }

  render() {
    const { history, page, pageCount, navigate } = this.props;

    return (
      <Page>
        <div className="card__list">
          {history && history.length ? (
            <React.Fragment>
              {history.map(item => <FileCard key={item.uri} uri={item.uri} />)}
              {pageCount > 1 && (
                <FormRow verticallyCentered centered>
                  <ReactPaginate
                    pageCount={pageCount}
                    pageRangeDisplayed={2}
                    previousLabel="‹"
                    nextLabel="›"
                    activeClassName="pagination__item--selected"
                    pageClassName="pagination__item"
                    previousClassName="pagination__item pagination__item--previous"
                    nextClassName="pagination__item pagination__item--next"
                    breakClassName="pagination__item pagination__item--break"
                    marginPagesDisplayed={2}
                    onPageChange={e => this.changePage(e.selected)}
                    forcePage={page}
                    initialPage={page}
                    containerClassName="pagination"
                  />

                  <FormField
                    className="paginate-channel"
                    onKeyUp={e => this.paginate(e)}
                    prefix={__('Go to page:')}
                    type="text"
                  />
                </FormRow>
              )}
            </React.Fragment>
          ) : (
            <p className="card__subtitle">
              {__('You have no saved history. Go')}{' '}
              <Button button="link" label={__('explore')} onClick={() => navigate('/discover')} />{' '}
              {__('the content available on LBRY!')}
            </p>
          )}
        </div>
      </Page>
    );
  }
}
export default UserHistoryPage;
