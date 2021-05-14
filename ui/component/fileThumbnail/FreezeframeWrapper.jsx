import React, { useEffect } from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import Freezeframe from './FreezeframeLite';
import useLazyLoading from 'effects/use-lazy-loading';

const FreezeframeWrapper = (props) => {
  const imgRef = React.useRef();
  const freezeframe = React.useRef();
  // eslint-disable-next-line
  const { src, className, children } = props;

  const srcLoaded = useLazyLoading(imgRef);

  useEffect(() => {
    if (srcLoaded) {
      freezeframe.current = new Freezeframe(imgRef.current);
    }
  }, [srcLoaded]);

  return (
    <div className={classnames(className, 'freezeframe-wrapper')}>
      <>
        <img ref={imgRef} data-src={src} className="freezeframe-img" />
        {children}
      </>
    </div>
  );
};

FreezeframeWrapper.propTypes = {
  src: PropTypes.string.isRequired,
  className: PropTypes.string.isRequired,
};

export default FreezeframeWrapper;
