// @flow
import * as React from 'react';
import classnames from 'classnames';
import Spinner from 'component/spinner';

// time in ms to wait to show loading spinner
const LOADER_TIMEOUT = 1000;

type Props = {
  children: React.Node | Array<React.Node>,
  pageTitle: ?string,
  notContained: ?boolean, // No max-width, but keep the padding
  loading: ?boolean,
  className: ?string,
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
    const { showLoader } = this.state;

    if (!this.loaderTimeout && !prevProps.loading && loading) {
      this.beginLoadingTimeout();
    } else if (!loading && this.loaderTimeout) {
      clearTimeout(this.loaderTimeout);
      if (showLoader) {
        this.removeLoader();
      }
    }
  }

  componentWillUnmount() {
    if (this.loaderTimeout) {
      clearTimeout(this.loaderTimeout);
    }
  }

  beginLoadingTimeout() {
    this.loaderTimeout = setTimeout(() => {
      this.setState({ showLoader: true });
    }, LOADER_TIMEOUT);
  }

  removeLoader() {
    this.setState({ showLoader: false });
  }

  loaderTimeout: ?TimeoutID;

  render() {
    const { children, notContained, loading, className } = this.props;
    const { showLoader } = this.state;

    return (
      <main
        className={classnames('main', className, {
          'main--contained': !notContained,
          'main--not-contained': notContained,
        })}
      >
        {!loading && children}
        {showLoader && (
          <div className="main--empty">
            <Spinner />
          </div>
        )}
      </main>
    );
  }
}

export default Page;
