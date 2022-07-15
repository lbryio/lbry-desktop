// @flow
import React from 'react';
import Button from 'component/button';
import Tooltip from 'component/common/tooltip';

type Props = {
  title: string,
  iconSize?: number,
  noStyle?: boolean,
  navigate?: string,
  requiresAuth?: boolean,
  requiresChannel?: boolean,
};

function FileActionButton(props: Props) {
  const { title, iconSize, noStyle, ...buttonProps } = props;
  const { navigate, requiresAuth, requiresChannel } = buttonProps;

  if (navigate || requiresAuth || requiresChannel) {
    return (
      <Tooltip title={title} arrow={false} enterDelay={100}>
        <div className="button--file-action--tooltip-wrapper">
          <Button
            button={noStyle ? 'alt' : undefined}
            className={noStyle ? undefined : 'button--file-action button--file-action--tooltip'}
            iconSize={iconSize || 16}
            {...buttonProps}
          />
        </div>
      </Tooltip>
    );
  }

  return (
    <Tooltip title={title} arrow={false} enterDelay={100}>
      <Button
        button={noStyle ? 'alt' : undefined}
        className={noStyle ? undefined : 'button--file-action'}
        iconSize={iconSize || 16}
        {...buttonProps}
      />
    </Tooltip>
  );
}

export default FileActionButton;
