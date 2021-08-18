// @flow
import * as React from 'react';
import { LOADING_BAR_COLOR } from 'config';
import LoadingBar from 'react-top-loading-bar';

function LoadingBarOneOff(props: any) {
  const loadingBarRef = React.useRef(null);

  React.useEffect(() => {
    if (loadingBarRef.current) {
      loadingBarRef.current.continuousStart();
    }
  }, []);

  return <LoadingBar color={LOADING_BAR_COLOR} ref={loadingBarRef} />;
}

export default LoadingBarOneOff;
