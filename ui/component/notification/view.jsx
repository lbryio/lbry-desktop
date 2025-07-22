// @flow
import React, { useState, useEffect } from 'react';
import classnames from 'classnames';
import Icon from 'component/common/icon';
import * as ICONS from 'constants/icons';

function Notification(props) {
  const { id, type = 'info', title, content, actions = [], duration = 5000, onClose, className } = props;

  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      onClose && onClose(id);
    }, 300);
  };

  const handleAction = (action) => {
    if (action.onClick) {
      action.onClick();
    }
    if (action.closeOnClick !== false) {
      handleClose();
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return ICONS.COMPLETE;
      case 'error':
        return ICONS.REMOVE;
      case 'warning':
        return ICONS.ALERT;
      case 'info':
      default:
        return ICONS.INFO;
    }
  };

  return (
    <div
      className={classnames('notification', `notification--${type}`, className, {
        'notification--exiting': isExiting,
      })}
    >
      <div className="notification__header">
        <div className="notification__title">{title}</div>
        <button className="notification__close" onClick={handleClose} aria-label="Close notification">
          <Icon icon={ICONS.REMOVE} size={16} />
        </button>
      </div>

      {content && <div className="notification__content">{content}</div>}

      {actions.length > 0 && (
        <div className="notification__actions">
          {actions.map((action, index) => (
            <button
              key={index}
              className={classnames('notification__action', {
                'notification__action--primary': action.primary,
              })}
              onClick={() => handleAction(action)}
            >
              {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default Notification;
