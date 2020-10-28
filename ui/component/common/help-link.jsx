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
      onClick={e => {
        if (href) {
          e.stopPropagation();
        }
      }}
      className="icon--help"
      icon={icon || ICONS.HELP}
      iconSize={14}
      description={description || __('Help')}
      href={href}
      navigate={navigate}
    />
  );
}
