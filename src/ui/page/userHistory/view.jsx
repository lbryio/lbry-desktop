// @flow
import React from 'react';
import Page from 'component/page';
import DownloadList from 'page/fileListDownloaded';

type Props = {};

class UserHistoryPage extends React.PureComponent<Props> {
  render() {
    return (
      <Page>
        <DownloadList {...this.props} />
      </Page>
    );
  }
}
export default UserHistoryPage;
