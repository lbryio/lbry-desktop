// @flow
import React, { useEffect } from 'react';
import classnames from 'classnames';
import Freezeframe from './FreezeframeLite';
import useLazyLoading from 'effects/use-lazy-loading';

type Props = {
  src: string,
  className: string,
  children: any,
};

const FreezeframeWrapper = (props: Props) => {
  const { src, className, children } = props;

  const imgRef = React.useRef();
  const freezeframe = React.useRef();

  const srcLoaded = useLazyLoading(imgRef);

  useEffect(() => {
    if (srcLoaded) {
      freezeframe.current = new Freezeframe(imgRef.current);
    }
  }, [srcLoaded]);

  return (
    <div className={classnames(className, 'freezeframe-wrapper')}>
      <img ref={imgRef} data-src={src} className="freezeframe-img" />
      {children}
    </div>
  );
};

export default FreezeframeWrapper;
