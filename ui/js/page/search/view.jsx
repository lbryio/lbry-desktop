import React from 'react';
import lbryuri from 'lbryuri';
import FileTile from 'component/fileTile'
import FileListSearch from 'component/fileListSearch'
import {ToolTip} from 'component/tooltip.js';
import {BusyMessage} from 'component/common.js';


class SearchPage extends React.Component{
  render() {
    const {
      query,
    } = this.props

    return (
      <main className="main--single-column">
        { lbryuri.isValid(query) ?
          <section className="section-spaced">
            <h3 className="card-row__header">
              Exact URL <ToolTip label="?" body="This is the resolution of a LBRY URL and not controlled by LBRY Inc."
                                 className="tooltip--header" />
            </h3>
            <FileTile uri={lbryuri.normalize(query)} showEmpty={FileTile.SHOW_EMPTY_PUBLISH} />
          </section> : '' }
        <section className="section-spaced">
          <h3 className="card-row__header">
            Search Results for {query} <ToolTip label="?" body="These search results are provided by LBRY, Inc."
                                                className="tooltip--header" />
          </h3>
          <FileListSearch query={query} />
        </section>
      </main>
    )
  }
}
export default SearchPage;
