// @flow
import React from 'react';
import FileTile from 'component/fileTile';
import ChannelTile from 'component/channelTile';
import Button from 'component/button';
import BusyIndicator from 'component/common/busy-indicator';
import { parseURI } from 'lbryURI';
import debounce from 'util/debounce';

const SEARCH_DEBOUNCE_TIME = 800;

const NoResults = () => {
  return <div className="file-tile">{__('No results')}</div>;
};

type Props = {
  search: string => void,
  query: string,
  isSearching: boolean,
  uris: ?Array<string>,
  downloadUris: ?Array<string>,
};

class FileListSearch extends React.PureComponent<Props> {
  constructor(props: Props) {
    super(props);
    this.debouncedSearch = debounce(this.props.search, SEARCH_DEBOUNCE_TIME);
  }

  componentDidMount() {
    const { search, query } = this.props;
    search(query);
  }

  componentWillReceiveProps(nextProps: Props) {
    const { query: nextQuery } = nextProps;
    const { query: currentQuerry } = this.props;

    if (nextQuery !== currentQuerry) {
      this.debouncedSearch(nextQuery);
    }
  }

  debouncedSearch: string => void;

  render() {
    const { uris, query, downloadUris, isSearching } = this.props;

    let fileResults = [];
    let channelResults = [];
    if (uris && uris.length) {
      uris.forEach(uri => {
        const isChannel = parseURI(uri).claimName[0] === '@';
        if (isChannel) {
          channelResults.push(uri);
        } else {
          fileResults.push(uri);
        }
      });
    }

    return (
      query && (
        <div className="search__results">
          <div className="search-result__column">
            <div className="file-list__header">{__('Files')}</div>
            {!isSearching &&
              (fileResults.length ? (
                fileResults.map(uri => <FileTile key={uri} uri={uri} />)
              ) : (
                <NoResults />
              ))}
          </div>

          <div className="search-result__column">
            <div className="file-list__header">{__('Channels')}</div>
            {!isSearching &&
              (channelResults.length ? (
                channelResults.map(uri => <ChannelTile key={uri} uri={uri} />)
              ) : (
                <NoResults />
              ))}
          </div>

          <div className="search-result__column">
            <div className="file-list__header">{__('Your downloads')}</div>
            {downloadUris && downloadUris.length ? (
              downloadUris.map(uri => <FileTile test key={uri} uri={uri} />)
            ) : (
              <NoResults />
            )}
          </div>
        </div>
      )
    );
  }
}

export default FileListSearch;
