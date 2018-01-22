import React from 'react';
import FileTile from 'component/fileTile';
import ChannelTile from 'component/channelTile';
import Link from 'component/link';
import { BusyMessage } from 'component/common';
import { Lbryuri } from 'lbry-redux';

const SearchNoResults = props => {
  // eslint-disable-next-line react/prop-types
  const { query } = props;

  /* eslint-disable jsx-a11y/anchor-is-valid */
  return (
    <section>
      <span className="empty">
        {(__('No one has checked anything in for %s yet.'), query)}{' '}
        <Link label={__('Be the first')} navigate="/publish" />
      </span>
    </section>
  );
};

class FileListSearch extends React.PureComponent {
  componentWillMount() {
    this.doSearch(this.props);
  }

  componentWillReceiveProps(props) {
    // eslint-disable-next-line react/prop-types
    if (props.query !== this.props.query) {
      this.doSearch(props);
    }
  }

  doSearch(props) {
    // eslint-disable-next-line react/prop-types
    this.props.search(props.query);
  }

  render() {
    // eslint-disable-next-line react/prop-types
    const { isSearching, uris, query } = this.props;

    return (
      <div>
        {isSearching && !uris && <BusyMessage message={__('Looking up the Dewey Decimals')} />}

        {isSearching && uris && <BusyMessage message={__('Refreshing the Dewey Decimals')} />}

        {uris && uris.length
          ? uris.map(
              uri =>
                Lbryuri.parse(uri).name[0] === '@' ? (
                  <ChannelTile key={uri} uri={uri} />
                ) : (
                  <FileTile key={uri} uri={uri} />
                )
            )
          : !isSearching && <SearchNoResults query={query} />}
      </div>
    );
  }
}

export default FileListSearch;
