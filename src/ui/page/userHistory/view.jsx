// @flow
import React from 'react';
import Page from 'component/page';
import UserHistory from 'component/navigationHistoryRecent';
import DownloadList from 'page/fileListDownloaded';

type Props = {};

class UserHistoryPage extends React.PureComponent<Props> {
  render() {
    return (
      <Page>
        <UserHistory {...this.props} />
        <DownloadList {...this.props} />
      </Page>
    );
  }
}
export default UserHistoryPage;
