// @flow
import * as ICONS from 'constants/icons';
import * as React from 'react';
import { isURIValid, normalizeURI, parseURI } from 'lbry-redux';
import FileTile from 'component/fileTile';
import ChannelTile from 'component/channelTile';
import FileListSearch from 'component/fileListSearch';
import Page from 'component/page';
import ToolTip from 'component/common/tooltip';
import Icon from 'component/common/icon';
import SearchOptions from 'component/searchOptions';

type Props = {
  query: ?string,
};

class SearchPage extends React.PureComponent<Props> {
  render() {
    const { query } = this.props;
    const isValid = isURIValid(query);

    let uri;
    let isChannel;
    if (isValid) {
      uri = normalizeURI(query);
      ({ isChannel } = parseURI(uri));
    }

    return (
      <Page noPadding>
        <section className="search">
          {query && isValid && (
            <header className="search__header">
              <h1 className="search__title">
                {`lbry://${query}`}
                <ToolTip
                  icon
                  body={__('This is the resolution of a LBRY URL and not controlled by LBRY Inc.')}
                >
                  <Icon icon={ICONS.HELP} />
                </ToolTip>
              </h1>
              {isChannel ? (
                <ChannelTile size="large" isSearchResult uri={uri} />
              ) : (
                <FileTile size="large" isSearchResult displayHiddenMessage uri={uri} />
              )}
            </header>
          )}

          <div className="search__results-wrapper">
            <SearchOptions />

            <FileListSearch query={query} />
            <div className="help">{__('These search results are provided by LBRY, Inc.')}</div>
          </div>
        </section>
      </Page>
    );
  }
}

export default SearchPage;
