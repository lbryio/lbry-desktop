// @flow
import * as React from 'react';
import LoadingBar from 'react-top-loading-bar';

// TODO: Retrieve from CSS?
export const COLOR_LOADING_BAR = '#2bbb90';

function LoadingBarOneOff(props: any) {
  const loadingBarRef = React.useRef(null);

  React.useEffect(() => {
    if (loadingBarRef.current) {
      loadingBarRef.current.continuousStart();
    }
  }, []);

  return <LoadingBar color={COLOR_LOADING_BAR} ref={loadingBarRef} />;
}

export default LoadingBarOneOff;
