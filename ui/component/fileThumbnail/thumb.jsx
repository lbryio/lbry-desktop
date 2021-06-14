// @flow
import React from 'react';
import classnames from 'classnames';
import type { Node } from 'react';
import useLazyLoading from 'effects/use-lazy-loading';

type Props = {
  thumb: string,
  children?: Node,
};

const Thumb = (props: Props) => {
  const { thumb, children } = props;
  const thumbnailRef = React.useRef(null);
  useLazyLoading(thumbnailRef);

  return (
    <div ref={thumbnailRef} data-background-image={thumb} className={classnames('media__thumb')}>
      {children}
    </div>
  );
};

export default Thumb;
