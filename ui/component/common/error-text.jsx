// @flow
import React from 'react';

type Props = {
  children: string,
};

export default function ErrorText(props: Props) {
  const { children } = props;

  if (!children) {
    return null;
  }

  // Add a period to the end of error messages
  let errorMessage = children[0].toUpperCase() + children.slice(1);
  errorMessage = errorMessage.endsWith('.') ? errorMessage : `${errorMessage}.`;

  return <span className="error__text">{errorMessage}</span>;
}
