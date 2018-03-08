// @flow
import * as React from 'react';
import { isURIValid, normalizeURI } from 'lbryURI';
import FileTile from 'component/fileTile';
import FileListSearch from 'component/fileListSearch';
import ToolTip from 'component/common/tooltip';
import Page from 'component/page';
import debounce from 'util/debounce';

type Props = {
  query: ?string,
  updateSearchQuery: (string) => void,
};

class SearchPage extends React.PureComponent<Props> {
  render() {
    const { query, updateSearchQuery } = this.props;
    return (
      <Page noPadding>
        <div className="search__wrapper">
          <input
            className="search__input"
            value={query}
            placeholder={__("Search for anything...")}
            onChange={(event) => updateSearchQuery(event.target.value)}
          />

        {isURIValid(query) && (
          <React.Fragment>
            <div className="file-list__header">
              {__('Exact URL')}
              <ToolTip
                label="?"
                body={__('This is the resolution of a LBRY URL and not controlled by LBRY Inc.')}
                className="tooltip--header"
              />
            </div>
            <FileTile fullWidth uri={normalizeURI(query)} showUri />
          </React.Fragment>
        )}
        <FileListSearch query={query} />
      </div>
      </Page>
    );
  }
}

export default SearchPage;
