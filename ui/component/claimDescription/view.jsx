// @flow
import React from 'react';
import MarkdownPreview from 'component/common/markdown-preview';

type Props = {
  description?: string,
};

function ClaimDescription(props: Props) {
  const { description } = props;

  return !description ? null : (
    <MarkdownPreview className="markdown-preview--description" content={description} simpleLinks />
  );
}

export default ClaimDescription;
