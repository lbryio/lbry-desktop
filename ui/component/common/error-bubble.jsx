// @flow
import React from 'react';

type Props = {
  title?: string,
  subtitle?: string,
  action?: any,
  children?: string,
};

const ErrorBubble = (props: Props) => {
  const { children, title, subtitle, action } = props;

  if (title && subtitle && action) {
    return (
      <div className="error-bubble">
        <div>
          <label>{title}</label>
          <span>{subtitle}</span>
        </div>
        {action}
      </div>
    );
  }

  if (!children) {
    return null;
  }

  return <span className="error-bubble">{children}</span>;
};

export default ErrorBubble;
