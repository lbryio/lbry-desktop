// @flow
import * as React from 'react';
import Page from 'component/page';
import VideoJs from 'component/viewers/videoViewer/internal/videojs';

export default function CheckoutPage() {
  return (
    <Page className="ads-test">
      <h1>ads test</h1>
      {/* $FlowFixMe */}
      <VideoJs adsTest />
    </Page>
  );
}
