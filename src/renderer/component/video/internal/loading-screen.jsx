import React from 'react';
import Spinner from 'component/common/spinner';

const LoadingScreen = ({ status, spinner = true }) => (
  <div className="video__loading-screen">
    <div>
      {spinner && <Spinner />}

      <div className="video__loading-status">{status}</div>
    </div>
  </div>
);

export default LoadingScreen;
