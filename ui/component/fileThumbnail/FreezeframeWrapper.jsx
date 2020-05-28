import React, { useEffect } from 'react';
import classnames from 'classnames';
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
    <div className={classnames(className, 'freezeframe-wrapper')}>
      <img ref={imgRef} src={src} className="freezeframe-img" />
    </div>
  );
};

FreezeframeWrapper.propTypes = {
  src: PropTypes.string.isRequired,
  className: PropTypes.string.isRequired,
};

export default FreezeframeWrapper;
