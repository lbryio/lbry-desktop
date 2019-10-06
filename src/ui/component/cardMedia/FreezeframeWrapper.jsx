import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import Freezeframe from 'freezeframe';

const FreezeframeWrapper = props => {
  const imgRef = React.useRef();
  const freezeframe = React.useRef();

  const { src, className, options } = props;

  useEffect(() => {
    freezeframe.current = new Freezeframe(imgRef.current, options);
  }, [options]);

  return (
    <div className={className}>
      <img ref={imgRef} src={src} />
    </div>
  );
};

FreezeframeWrapper.propTypes = {
  src: PropTypes.string.isRequired,
  className: PropTypes.string.isRequired,
  // Docs: https://github.com/ctrl-freaks/freezeframe.js/tree/master/packages/freezeframe
  options: PropTypes.shape({
    selector: PropTypes.string,
    trigger: PropTypes.oneOf(['hover', 'click', false]),
    overlay: PropTypes.boolean,
    responsive: PropTypes.boolean,
  }),
};

export default FreezeframeWrapper;
