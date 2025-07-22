import React from 'react';
import classnames from 'classnames';

function Progress(props) {
  const {
    value = 0,
    max = 100,
    size = 'medium',
    variant = 'default',
    showLabel = false,
    animated = true,
    className,
  } = props;

  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  const isComplete = percentage >= 100;

  return (
    <div className={classnames('progress', `progress--${size}`, `progress--${variant}`, className)}>
      <div className="progress__track">
        <div
          className={classnames('progress__bar', {
            'progress__bar--animated': animated && !isComplete,
            'progress__bar--complete': isComplete,
          })}
          style={{ width: `${percentage}%` }}
        />
        {animated && !isComplete && <div className="progress__shimmer" />}
      </div>

      {showLabel && <div className="progress__label">{Math.round(percentage)}%</div>}
    </div>
  );
}

export default Progress;
