// @flow
import React from 'react';
import Page from 'component/page';
import UserHistory from 'component/userHistory';

class UserHistoryPage extends React.PureComponent {
  render() {
    return (
      <Page>
        <UserHistory />
      </Page>
    );
  }
}
export default UserHistoryPage;
