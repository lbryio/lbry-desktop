// @flow
import * as React from 'react';
import { isURIValid, normalizeURI } from 'lbry-redux';
import FileTile from 'component/fileTile';
import FileListSearch from 'component/fileListSearch';
import ToolTip from 'component/common/tooltip';
import Page from 'component/page';
import Icon from 'component/common/icon';
import * as icons from 'constants/icons';

type Props = {
  query: ?string,
};

class SearchPage extends React.PureComponent<Props> {
  render() {
    const { query } = this.props;
    return (
      <Page>
        {isURIValid(query) && (
          <React.Fragment>
            <div className="file-list__header">
              {__('Exact URL')}
              <ToolTip
                icon
                body={__('This is the resolution of a LBRY URL and not controlled by LBRY Inc.')}
              >
                <Icon icon={icons.HELP} />
              </ToolTip>
            </div>
            <FileTile fullWidth uri={normalizeURI(query)} showUri />
          </React.Fragment>
        )}
        <FileListSearch query={query} />
        <div className="help">{__('These search results are provided by LBRY, Inc.')}</div>
      </Page>
    );
  }
}

export default SearchPage;
