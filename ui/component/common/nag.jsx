// @flow
import type { Node } from 'react';
import * as ICONS from 'constants/icons';
import classnames from 'classnames';
import React from 'react';
import Button from 'component/button';

type Props = {
  message: string | Node,
  actionText?: string,
  href?: string,
  type?: string,
  inline?: boolean,
  relative?: boolean,
  onClick?: () => void,
  onClose?: () => void,
};

export default function Nag(props: Props) {
  const { message, actionText, href, onClick, onClose, type, inline, relative } = props;

  const buttonProps = onClick ? { onClick } : { href };

  return (
    <div
      className={classnames('nag', {
        'nag--helpful': type === 'helpful',
        'nag--error': type === 'error',
        'nag--inline': inline,
        'nag--relative': relative,
      })}
    >
      <div className="nag__message">{message}</div>
      {(href || onClick) && (
        <Button
          className={classnames('nag__button', {
            'nag__button--helpful': type === 'helpful',
            'nag__button--error': type === 'error',
          })}
          {...buttonProps}
        >
          {actionText}
        </Button>
      )}
      {onClose && (
        <Button
          className={classnames('nag__button nag__close', {
            'nag__button--helpful': type === 'helpful',
            'nag__button--error': type === 'error',
          })}
          icon={ICONS.REMOVE}
          onClick={onClose}
        />
      )}
    </div>
  );
}
