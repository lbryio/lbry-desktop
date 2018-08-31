// @flow
import React from 'react';
import FileCard from 'component/fileCard';
import Page from 'component/page';
import Button from 'component/button';
import { FormField, FormRow } from 'component/common/form';
import ReactPaginate from 'react-paginate';
import UserHistoryItem from 'component/userHistoryItem';

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
  constructor() {
    super();

    this.state = {
      itemsSelected: {},
    };

    this.selectAll = this.selectAll.bind(this);
    this.unselectAll = this.unselectAll.bind(this);
    this.removeSelected = this.removeSelected.bind(this);
  }

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

  onSelect(uri: string) {
    this.setState({
      itemsSelected: { ...this.state.itemsSelected, [uri]: !this.state.itemsSelected[uri] },
    });
  }

  selectAll() {
    const { history } = this.props;
    const newSelectedState = {};
    history.forEach(({ uri }) => (newSelectedState[uri] = true));
    this.setState({ itemsSelected: newSelectedState });
  }

  unselectAll() {
    this.setState({
      itemsSelected: {},
    });
  }

  removeSelected() {
    const { clearHistoryUri } = this.props;
    const { itemsSelected } = this.state;

    Object.keys(itemsSelected).forEach(uri => clearHistoryUri(uri));
    this.setState({
      itemsSelected: {},
    });
  }

  render() {
    const { history, page, pageCount, navigate } = this.props;
    const { itemsSelected } = this.state;

    const allSelected = Object.keys(itemsSelected).length === history.length;
    const selectHandler = allSelected ? this.unselectAll : this.selectAll;
    return (
      <React.Fragment>
        <div className="card__actions card__actions--between">
          {!!Object.keys(itemsSelected).length ? (
            <Button button="link" label={__('Delete')} onClick={this.removeSelected} />
          ) : (
            <span />
          )}

          <Button
            button="link"
            label={allSelected ? __('Cancel') : __('Select All')}
            onClick={selectHandler}
          />
        </div>
        {!!history.length && (
          <table className="card--section table table--stretch table--history">
            <tbody>
              {history.map(item => (
                <UserHistoryItem
                  key={item.uri}
                  uri={item.uri}
                  lastViewed={item.lastViewed}
                  selected={!!itemsSelected[item.uri]}
                  onSelect={() => {
                    this.onSelect(item.uri);
                  }}
                />
              ))}
            </tbody>
          </table>
        )}
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
    );
  }
}
export default UserHistoryPage;
