import React from 'react';
import classnames from 'classnames';

export default ({ dark, className }) => (
  <div
    className={classnames(
      'spinner',
      {
        'spinner--dark': dark,
      },
      className
    )}
  />
);
