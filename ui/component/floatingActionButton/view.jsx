import React, { useState } from 'react';
import classnames from 'classnames';
import Icon from 'component/common/icon';
import Tooltip from 'component/tooltip';

function FloatingActionButton(props) {
  const {
    icon,
    label,
    onClick,
    position = 'bottom-right',
    size = 'medium',
    color = 'primary',
    disabled = false,
    className,
    tooltip,
    children,
  } = props;

  const [isPressed, setIsPressed] = useState(false);

  const handleClick = (e) => {
    if (disabled) return;

    setIsPressed(true);
    setTimeout(() => setIsPressed(false), 150);

    if (onClick) {
      onClick(e);
    }
  };

  const buttonContent = (
    <button
      className={classnames(
        'fab',
        `fab--${position}`,
        `fab--${size}`,
        `fab--${color}`,
        {
          'fab--disabled': disabled,
          'fab--pressed': isPressed,
        },
        className
      )}
      onClick={handleClick}
      disabled={disabled}
      aria-label={label}
    >
      <Icon icon={icon} className="fab__icon" />
      {children}
    </button>
  );

  if (tooltip) {
    return (
      <Tooltip content={tooltip} position="left">
        {buttonContent}
      </Tooltip>
    );
  }

  return buttonContent;
}

export default FloatingActionButton;
