// @flow
import React from 'react';
import { isURIValid, normalizeURI } from 'lbryURI';
import FileTile from 'component/fileTile';
import FileListSearch from 'component/fileListSearch';
import ToolTip from 'component/common/tooltip';
import Page from 'component/page';

type Props = {
  query: ?string,
};

class SearchPage extends React.PureComponent<Props> {
  render() {
    const { query } = this.props;

    return (
      <Page>
        {isURIValid(query) ? (
          <section className="section-spaced">
            <h3 className="card-row__header">
              {__('Exact URL')}{' '}
              <ToolTip
                label="?"
                body={__('This is the resolution of a LBRY URL and not controlled by LBRY Inc.')}
                className="tooltip--header"
              />
            </h3>
            <FileTile uri={normalizeURI(query)} showEmpty={FileTile.SHOW_EMPTY_PUBLISH} />
          </section>
        ) : (
          ''
        )}
        <section className="section-spaced">
          <h3 className="card-row__header">
            {__('Search Results for')} {query}{' '}
            <ToolTip
              label="?"
              body={__('These search results are provided by LBRY, Inc.')}
              className="tooltip--header"
            />
          </h3>
          <FileListSearch query={query} />
        </section>
      </Page>
    );
  }
}
export default SearchPage;
