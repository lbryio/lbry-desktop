// @flow
import React from 'react';
import ChannelEdit from 'component/channelEdit';
import Page from 'component/page';
import { withRouter } from 'react-router';

type Props = {
  history: { goBack: () => void },
};

function ChannelNew(props: Props) {
  const { history } = props;
  return (
    <Page
      noSideNavigation
      backout={{ backFunction: () => history.goBack(), title: __('Create Channel') }}
      className="main--auth-page"
    >
      <ChannelEdit onDone={history.goBack} />
    </Page>
  );
}

export default withRouter(ChannelNew);
