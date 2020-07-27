// @flow
import * as ICONS from 'constants/icons';
import React from 'react';
import Button from 'component/button';

type Props = {
  href?: string,
  navigate?: string,
  icon?: string,
  description?: string,
};

export default function HelpLink(props: Props) {
  const { href, navigate, icon, description } = props;
  return (
    <Button
      className="icon--help"
      icon={icon || ICONS.HELP}
      description={description || __('Help')}
      href={href}
      navigate={navigate}
    />
  );
}
