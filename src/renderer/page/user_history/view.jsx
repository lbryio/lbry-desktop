import React from 'react';
import { isURIValid, normalizeURI } from 'lbryURI';
import FileTile from 'component/fileTile';
import FileListSearch from 'component/fileListSearch';
import { ToolTip } from 'component/tooltip.js';
import SubHeader from 'component/subHeader';

class UserHistoryPage extends React.PureComponent {
  render() {
    const { history } = this.props;

    return (
      <div>
        <main className="main--no-margin">
          <SubHeader fullWidth smallMargin />
          <section className="section-spaced">
            <div style={{width: "800px"}}>
              {Object.keys(history).length > 0 ?
                Object.keys(history).map(uri => (
                  <FileTile key={uri} uri={normalizeURI(uri)} />
                )
              ) : (
                <p>You have no saved history. Go find some content!</p>
              )}
            </div>
          </section>
        </main>
      </div>
    );
  }
}
export default UserHistoryPage;
