import React, { Suspense } from 'react';

const MarkdownPreviewInternal = React.lazy(() =>
  import(/* webpackChunkName: "markdownPreview" */
  /* webpackPrefetch: true */
  './markdown-preview-internal')
);

const MarkdownPreview = props => {
  return (
    <Suspense fallback={<div className="markdown-preview" />}>
      <MarkdownPreviewInternal {...props} />
    </Suspense>
  );
};

export default MarkdownPreview;
