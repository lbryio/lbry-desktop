// @flow
import React from 'react';
import Button from 'component/button';

type Props = {
  id: string,
};

const TransactionLink = (props: Props) => {
  const { id } = props;

  const href = `https://explorer.lbry.com/tx/${id}`;
  const label = id.slice(0, 7);

  return <Button button="link" href={href} label={label} />;
};

export default TransactionLink;
