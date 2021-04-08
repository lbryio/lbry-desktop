// @flow
import React from 'react';
import Page from 'component/page';
import ReportContent from 'component/reportContent';

export default function ReportContentPage(props: any) {
  return (
    <Page
      noSideNavigation
      className="main--report-content"
      backout={{
        backoutLabel: __('Done'),
        title: __('Report content'),
      }}
    >
      <ReportContent />
    </Page>
  );
}
