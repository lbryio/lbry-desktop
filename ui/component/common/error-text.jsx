// @flow
import React from 'react';

type Props = {
  children: any,
};

export default function ErrorText(props: Props) {
  const { children } = props;

  return <span className="error__text">{children}</span>;
}
