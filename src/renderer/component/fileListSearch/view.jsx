import React from 'react';
import FileTile from 'component/fileTile';
import ChannelTile from 'component/channelTile';
import Link from 'component/link';
import { BusyMessage } from 'component/common.js';
import { parseURI } from 'lbryURI';

const SearchNoResults = props => {
  const { query } = props;

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
    if (props.query != this.props.query) {
      this.doSearch(props);
    }
  }

  doSearch(props) {
    this.props.search(props.query);
  }

  render() {
    const { isSearching, uris, query } = this.props;

    return (
      <div>
        {isSearching && !uris && <BusyMessage message={__('Looking up the Dewey Decimals')} />}

        {isSearching && uris && <BusyMessage message={__('Refreshing the Dewey Decimals')} />}

        {uris && uris.length
          ? uris.map(
              uri =>
                parseURI(uri).name[0] === '@' ? (
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
