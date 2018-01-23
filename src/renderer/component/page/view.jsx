// @flow
import * as React from 'react';
import classnames from 'classnames';

type Props = {
  children: React.Node,
  pageTitle: ?string,
  noPadding: ?boolean,
};

const Page = (props: Props) => {
  const { pageTitle, children, noPadding } = props;
  return (
    <main className={classnames('main', { 'main--no-padding': noPadding })}>
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
