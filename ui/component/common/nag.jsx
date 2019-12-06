// @flow
import * as ICONS from 'constants/icons';
import React from 'react';
import Button from 'component/button';

type Props = {
  message: string,
  actionText: string,
  href?: string,
  onClick?: () => void,
  onClose?: () => void,
};

export default function Nag(props: Props) {
  const { message, actionText, href, onClick, onClose } = props;

  const buttonProps = onClick ? { onClick } : { href };

  return (
    <div className="nag">
      {message}
      <Button className="nag__button" {...buttonProps}>
        {actionText}
      </Button>
      {onClose && <Button className="nag__button nag__close" icon={ICONS.REMOVE} onClick={onClose} />}
    </div>
  );
}
