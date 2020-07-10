// @flow
import React from 'react';
import ChannelEdit from 'component/channelEdit';
import Page from 'component/page';
import { withRouter } from 'react-router';
import * as PAGES from 'constants/pages';

type Props = {
  history: { push: string => void, goBack: () => void },
};

function ChannelNew(props: Props) {
  const { history } = props;
  return (
    <Page noSideNavigation backout={{ title: __('Create Channel') }} className="main--auth-page">
      <ChannelEdit onDone={() => history.push(`/$/${PAGES.CHANNELS}`)} />
    </Page>
  );
}

export default withRouter(ChannelNew);
