// @flow
import React from 'react';
import classnames from 'classnames';

type Props = {
  text: string,
  padded?: boolean,
};

export default function Empty(props: Props) {
  const { text = '', padded = false } = props;

  return (
    <div className={classnames('empty__wrap', { 'empty__wrap--padded': padded })}>
      <div>
        {text && (
          <div className="empty__content">
            <p className="empty__text">{text}</p>
          </div>
        )}
      </div>
    </div>
  );
}
