// @flow
import * as React from 'react';
import classnames from 'classnames';
import Spinner from 'component/spinner';
import { isShowingChildren } from 'util/dom';

// time in ms to wait to show loading spinner
const LOADER_TIMEOUT = 1500;

type Props = {
  children: React.Node | Array<React.Node>,
  pageTitle: ?string,
  noPadding: ?boolean,
  extraPadding: ?boolean,
  notContained: ?boolean, // No max-width, but keep the padding
  loading: ?boolean,
};

type State = {
  showLoader: ?boolean,
};

class Page extends React.PureComponent<Props, State> {
  static getDerivedStateFromProps(nextProps: Props, prevState: State) {
    const { children } = nextProps;
    const { showLoader } = prevState;

    // If we aren't showing the loader, don't bother updating
    if (!showLoader) {
      return null;
    }

    if (isShowingChildren(children)) {
      return {
        showLoader: false,
      };
    }
    return null;
  }

  constructor() {
    super();

    this.state = {
      showLoader: false,
    };

    this.loaderTimeout = null;
  }

  componentDidMount() {
    const { children } = this.props;

    if (!isShowingChildren(children))
      this.loaderTimeout = setTimeout(() => {
        this.setState({ showLoader: true });
      }, LOADER_TIMEOUT);
  }

  componentWillUnmount() {
    this.loaderTimeout = null;
  }

  loaderTimeout: ?TimeoutID;

  render() {
    const { pageTitle, children, noPadding, extraPadding, notContained, loading } = this.props;
    const { showLoader } = this.state;

    // We don't want to show the loading spinner right away if it will only flash on the
    // screen for a short time, wait until we know it will be loading for a bit before showing it
    const shouldShowLoader = loading || (!isShowingChildren(children) && showLoader);

    return (
      <main
        className={classnames('main', {
          'main--contained': !notContained && !noPadding && !extraPadding,
          'main--no-padding': noPadding,
          'main--extra-padding': extraPadding,
        })}
      >
        {pageTitle && (
          <div className="page__header">
            {pageTitle && <h1 className="page__title">{pageTitle}</h1>}
          </div>
        )}
        {!loading && children}
        {shouldShowLoader && (
          <div className="page__empty">
            <Spinner />
          </div>
        )}
      </main>
    );
  }
}

export default Page;
