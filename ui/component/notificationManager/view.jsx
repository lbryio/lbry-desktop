import React, { useState, useCallback } from 'react';
import Notification from 'component/notification';

function NotificationManager() {
  const [notifications, setNotifications] = useState([]);

  const addNotification = useCallback((notification) => {
    const id = Date.now() + Math.random();
    const newNotification = { ...notification, id };
    setNotifications((prev) => [...prev, newNotification]);
    return id;
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id));
  }, []);

  const showSuccess = useCallback(
    (title, content, options = {}) => {
      return addNotification({
        type: 'success',
        title,
        content,
        ...options,
      });
    },
    [addNotification]
  );

  const showError = useCallback(
    (title, content, options = {}) => {
      return addNotification({
        type: 'error',
        title,
        content,
        ...options,
      });
    },
    [addNotification]
  );

  const showWarning = useCallback(
    (title, content, options = {}) => {
      return addNotification({
        type: 'warning',
        title,
        content,
        ...options,
      });
    },
    [addNotification]
  );

  const showInfo = useCallback(
    (title, content, options = {}) => {
      return addNotification({
        type: 'info',
        title,
        content,
        ...options,
      });
    },
    [addNotification]
  );

  // Expose methods globally for easy access
  React.useEffect(() => {
    window.notificationManager = {
      addNotification,
      removeNotification,
      showSuccess,
      showError,
      showWarning,
      showInfo,
    };
  }, [addNotification, removeNotification, showSuccess, showError, showWarning, showInfo]);

  return (
    <div className="notifications-container">
      {notifications.map((notification) => (
        <Notification key={notification.id} {...notification} onClose={removeNotification} />
      ))}
    </div>
  );
}

export default NotificationManager;
