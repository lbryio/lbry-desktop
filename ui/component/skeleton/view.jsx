import React from 'react';
import classnames from 'classnames';

function Skeleton(props) {
  const { type = 'text', textLength = 'medium', lines = 1, className, children } = props;

  const renderSkeleton = () => {
    switch (type) {
      case 'text':
        return (
          <div className="skeleton--text-container">
            {Array.from({ length: lines }, (_, index) => (
              <div
                key={index}
                className={classnames('skeleton skeleton--text', {
                  [`skeleton--text--${textLength}`]: index === 0,
                  'skeleton--text--long': index > 0,
                })}
              />
            ))}
          </div>
        );

      case 'avatar':
        return <div className="skeleton skeleton--avatar" />;

      case 'thumbnail':
        return <div className="skeleton skeleton--thumbnail" />;

      case 'card':
        return (
          <div className="skeleton skeleton--card">
            <div className="skeleton--header">
              <div className="skeleton skeleton--avatar" />
              <div className="skeleton skeleton--text skeleton--text--medium" />
            </div>
            <div className="skeleton--content">
              <div className="skeleton skeleton--text skeleton--text--long" />
              <div className="skeleton skeleton--text skeleton--text--short" />
              <div className="skeleton skeleton--text skeleton--text--medium" />
            </div>
          </div>
        );

      case 'button':
        return <div className="skeleton skeleton--button" />;

      case 'navigation':
        return <div className="skeleton skeleton--navigation" />;

      default:
        return <div className="skeleton skeleton--text" />;
    }
  };

  return <div className={classnames('skeleton-wrapper', className)}>{children || renderSkeleton()}</div>;
}

export default Skeleton;
