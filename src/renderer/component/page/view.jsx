// @flow
import * as React from 'react';
import classnames from 'classnames';

type Props = {
  children: React.Node,
  pageTitle: ?string,
  noPadding: ?boolean,
  extraPadding: ?boolean,
  notContained: ?boolean, // No max-width, but keep the padding
};

const Page = (props: Props) => {
  const { pageTitle, children, noPadding, extraPadding, notContained } = props;
  return (
    <main
      className={classnames('main', {
        'main--contained': !notContained && !noPadding && !extraPadding,
        'main--no-padding': noPadding,
        'main--extra-padding': extraPadding,
      })}
    >
      {pageTitle && (
        <div className="page__header">
          {pageTitle && <h1 className="page__title">{pageTitle}</h1>}
        </div>
      )}
      {children}
    </main>
  );
};

export default Page;
