import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import Freezeframe from './FreezeframeLite';

const FreezeframeWrapper = props => {
  const imgRef = React.useRef();
  const freezeframe = React.useRef();

  const { src, className } = props;

  useEffect(() => {
    freezeframe.current = new Freezeframe(imgRef.current);
  }, []);

  return (
    <div className={className}>
      <img ref={imgRef} src={src} />
    </div>
  );
};

FreezeframeWrapper.propTypes = {
  src: PropTypes.string.isRequired,
  className: PropTypes.string.isRequired,
};

export default FreezeframeWrapper;
