// @flow
import * as React from 'react';
import classnames from 'classnames';
import { BusyMessage } from 'component/common';

type Props = {
  children: React.Node,
  title: ?string,
  noPadding: ?boolean,
  isLoading: ?boolean,
};

const Page = (props: Props) => {
  const { children, title, noPadding, isLoading } = props;
  return (
    <main id="main-content">
      <div className="page__header">
        {title && <h1 className="page__title">{title}</h1>}
        {isLoading && <BusyMessage message={__('Fetching content')} />}
      </div>
      <div className={classnames('main', { 'main--no-padding': noPadding })}>{children}</div>
    </main>
  );
};

export default Page;
