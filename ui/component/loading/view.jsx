import React from 'react';
import classnames from 'classnames';
import Skeleton from 'component/skeleton';

function Loading(props) {
  const { type = 'spinner', size = 'medium', text, fullScreen = false, overlay = false, className } = props;

  const renderLoading = () => {
    switch (type) {
      case 'spinner':
        return (
          <div className={classnames('spinner', `spinner--${size}`, className)}>
            {text && <div className="loading__text">{text}</div>}
          </div>
        );

      case 'dots':
        return (
          <div className={classnames('spinner spinner--dots', className)}>
            <div className="spinner__dot"></div>
            <div className="spinner__dot"></div>
            <div className="spinner__dot"></div>
            {text && <div className="loading__text">{text}</div>}
          </div>
        );

      case 'pulse':
        return (
          <div className={classnames('spinner spinner--pulse', `spinner--${size}`, className)}>
            {text && <div className="loading__text">{text}</div>}
          </div>
        );

      case 'skeleton':
        return <Skeleton {...props} />;

      default:
        return (
          <div className={classnames('spinner', `spinner--${size}`, className)}>
            {text && <div className="loading__text">{text}</div>}
          </div>
        );
    }
  };

  if (fullScreen) {
    return (
      <div className="loading--fullscreen">
        <div className="loading__content">{renderLoading()}</div>
      </div>
    );
  }

  if (overlay) {
    return (
      <div className="loading--overlay">
        <div className="loading__content">{renderLoading()}</div>
      </div>
    );
  }

  return renderLoading();
}

export default Loading;
