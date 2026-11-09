import React from 'react';
import classnames from 'classnames';
import type { ReactNode } from 'react';
import useLazyLoading from 'effects/use-lazy-loading';

type Props = {
  thumb: string,
  fallback: string | null | undefined,
  children?: React.ReactNode,
  className?: string
};

const Thumb = (props: Props) => {
  const { thumb, fallback, children, className } = props;
  const thumbnailRef = React.useRef(null);

  useLazyLoading(thumbnailRef, fallback || '');

  return (
    <div ref={thumbnailRef} data-background-image={thumb} className={classnames('media__thumb', className)}>
      {children}
    </div>
  );
};

export default Thumb;
