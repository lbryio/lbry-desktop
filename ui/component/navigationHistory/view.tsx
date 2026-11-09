import * as React from 'react';
import Button from 'component/button';
import NavigationHistoryItem from 'component/navigationHistoryItem';
import Paginate from 'component/common/paginate';

type HistoryItem = {
  uri: string,
  lastViewed: number
};

type Props = {
  historyItems: Array<HistoryItem>,
  pageCount: number,
  clearHistoryUri: (arg1: string) => void
};

type State = {
  itemsSelected: Record<any, any>
};

class UserHistoryPage extends React.PureComponent<Props, State> {
  constructor() {
// @ts-expect-error - TS2554 - Expected 1-2 arguments, but got 0.
    super();

    this.state = {
      itemsSelected: {},
    };

    (this as any).selectAll = this.selectAll.bind(this);
    (this as any).unselectAll = this.unselectAll.bind(this);
    (this as any).removeSelected = this.removeSelected.bind(this);
  }

  onSelect(uri: string) {
    const { itemsSelected } = this.state;

    const newItemsSelected = { ...itemsSelected } as const;
    if (itemsSelected[uri]) {
// @ts-expect-error - TS2542 - Index signature in type '{ readonly [x: string]: any; }' only permits reading.
      delete newItemsSelected[uri];
    } else {
// @ts-expect-error - TS2542 - Index signature in type '{ readonly [x: string]: any; }' only permits reading.
      newItemsSelected[uri] = true;
    }

    this.setState({
      itemsSelected: { ...newItemsSelected },
    });
  }

  selectAll() {
    const { historyItems } = this.props;
    const newSelectedState: Record<string, any> = {};
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
            // @ts-expect-error - TS2322 (ts-migration)
            <Button button="link" label={__('Delete')} onClick={this.removeSelected} />
          ) : (
            <span>{/* Using an empty span so spacing stays the same if the button isn't rendered */}</span>
          )}
          {/* @ts-expect-error - TS2322 (ts-migration) */}
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
            {/* @ts-expect-error - TS2322 (ts-migration) */}
            <Button button="primary" navigate="/" label={__('Explore new content')} />
          </div>
        </section>
      </div>
    );
  }
}
export default UserHistoryPage;
