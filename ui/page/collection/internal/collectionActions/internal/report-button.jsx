// @flow
import * as PAGES from 'constants/pages';
import * as ICONS from 'constants/icons';
import React from 'react';
import FileActionButton from 'component/common/file-action-button';

type Props = {
  claimId: string,
};

function CollectionReportButton(props: Props) {
  const { claimId } = props;

  return (
    <FileActionButton
      title={__('Report content')}
      icon={ICONS.REPORT}
      navigate={`/$/${PAGES.REPORT_CONTENT}?claimId=${claimId}`}
    />
  );
}

export default CollectionReportButton;
