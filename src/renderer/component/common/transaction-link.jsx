// @flow
import React from 'react';
import Link from 'component/link';

type Props = {
  id: string,
}

const TransactionLink = (props: Props) => {
  const { id } = props;

  const href = `https://explorer.lbry.io/#!/transaction/${id}`;
  const label = id.substr(0, 7);

  return <Link button="link" href={href} label={label} />;
};

export default TransactionLink;
