// @flow
import * as React from 'react';
import classnames from 'classnames';
import Spinner from 'component/spinner';

// time in ms to wait to show loading spinner
const LOADER_TIMEOUT = 1000;

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
  constructor() {
    super();

    this.state = {
      showLoader: false,
    };

    this.loaderTimeout = null;
  }

  componentDidMount() {
    const { loading } = this.props;
    if (loading) {
      this.beginLoadingTimeout();
    }
  }

  componentDidUpdate(prevProps: Props) {
    const { loading } = this.props;
    if (!this.loaderTimeout && !prevProps.loading && loading) {
      this.beginLoadingTimeout();
    }
  }

  componentWillUnmount() {
    if (this.loaderTimeout) {
      this.loaderTimeout = null;
    }
  }

  beginLoadingTimeout() {
    this.loaderTimeout = setTimeout(() => {
      this.setState({ showLoader: true });
    }, LOADER_TIMEOUT);
  }

  loaderTimeout: ?TimeoutID;

  render() {
    const { pageTitle, children, noPadding, extraPadding, notContained, loading } = this.props;
    const { showLoader } = this.state;

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
        {showLoader && (
          <div className="page__empty">
            <Spinner />
          </div>
        )}
      </main>
    );
  }
}

export default Page;
