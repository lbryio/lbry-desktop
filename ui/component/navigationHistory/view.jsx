// @flow
import * as React from 'react';
import Button from 'component/button';
import NavigationHistoryItem from 'component/navigationHistoryItem';
import Paginate from 'component/common/paginate';

type HistoryItem = {
  uri: string,
  lastViewed: number,
};

type Props = {
  historyItems: Array<HistoryItem>,
  pageCount: number,
  clearHistoryUri: string => void,
};

type State = {
  itemsSelected: {},
};

class UserHistoryPage extends React.PureComponent<Props, State> {
  constructor() {
    super();

    this.state = {
      itemsSelected: {},
    };

    (this: any).selectAll = this.selectAll.bind(this);
    (this: any).unselectAll = this.unselectAll.bind(this);
    (this: any).removeSelected = this.removeSelected.bind(this);
  }

  onSelect(uri: string) {
    const { itemsSelected } = this.state;

    const newItemsSelected = { ...itemsSelected };
    if (itemsSelected[uri]) {
      delete newItemsSelected[uri];
    } else {
      newItemsSelected[uri] = true;
    }

    this.setState({
      itemsSelected: { ...newItemsSelected },
    });
  }

  selectAll() {
    const { historyItems } = this.props;
    const newSelectedState = {};
    historyItems.forEach(({ uri }) => (newSelectedState[uri] = true));
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
    const { historyItems = [], pageCount } = this.props;
    const { itemsSelected } = this.state;
    const allSelected = Object.keys(itemsSelected).length === historyItems.length;
    const selectHandler = allSelected ? this.unselectAll : this.selectAll;

    return historyItems.length ? (
      <React.Fragment>
        <div className="card__actions">
          {Object.keys(itemsSelected).length ? (
            <Button button="link" label={__('Delete')} onClick={this.removeSelected} />
          ) : (
            <span>{/* Using an empty span so spacing stays the same if the button isn't rendered */}</span>
          )}
          <Button button="link" label={allSelected ? __('Cancel') : __('Select All')} onClick={selectHandler} />
        </div>
        {!!historyItems.length && (
          <section className="card  item-list">
            {historyItems.map(item => (
              <NavigationHistoryItem
                key={item.uri}
                uri={item.uri}
                lastViewed={item.lastViewed}
                selected={!!itemsSelected[item.uri]}
                onSelect={() => {
                  this.onSelect(item.uri);
                }}
              />
            ))}
          </section>
        )}
        <Paginate totalPages={pageCount} />
      </React.Fragment>
    ) : (
      <div className="main--empty">
        <section className="card card--section">
          <h2 className="card__title card__title--deprecated">
            {__('Your history is empty, what are you doing here?')}
          </h2>

          <div className="card__actions card__actions--center">
            <Button button="primary" navigate="/" label={__('Explore new content')} />
          </div>
        </section>
      </div>
    );
  }
}
export default UserHistoryPage;
