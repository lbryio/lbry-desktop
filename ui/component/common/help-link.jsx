// @flow
import * as ICONS from 'constants/icons';
import React from 'react';
import Button from 'component/button';

type Props = {
  href?: string,
  navigate?: string,
};

export default function HelpLink(props: Props) {
  const { href, navigate } = props;
  return <Button className="icon--help" icon={ICONS.HELP} description={__('Help')} href={href} navigate={navigate} />;
}
