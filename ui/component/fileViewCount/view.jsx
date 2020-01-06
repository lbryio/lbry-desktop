// @flow
import React from 'react';
import HelpLink from 'component/common/help-link';

type Props = {
  viewCount: string,
};

function FileViewCount(props: Props) {
  const { viewCount } = props;

  return (
    <span>
      {viewCount !== 1 ? __('%view_count% Views', { view_count: viewCount }) : __('1 View')}
      <HelpLink href="https://lbry.com/faq/views" />
    </span>
  );
}

export default FileViewCount;
