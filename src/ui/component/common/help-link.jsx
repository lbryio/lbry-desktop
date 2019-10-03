// @flow
import * as ICONS from 'constants/icons';
import React from 'react';
import Button from 'component/button';

type Props = {
  href: string,
};

export default function HelpLink(props: Props) {
  const { href } = props;
  return <Button className="icon--help" icon={ICONS.HELP} description={__('Help')} href={href} />;
}
