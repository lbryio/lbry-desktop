// @flow
import React from 'react';
import { SIMPLE_SITE } from 'config';
import { useIsMobile } from 'effects/use-screensize';

type Props = {
  type: string,
  isAuthenticated: boolean,
};

const Pixel = (props: Props) => {
  const { type, isAuthenticated } = props;
  const isMobile = useIsMobile();

  // TODO: restrict to country
  if (!SIMPLE_SITE || isMobile || isAuthenticated) {
    return null;
  }
  if (type === 'retargeting') {
    return (
      <>
        <img
          src="https://ctrack.trafficjunky.net/ctrack?action=list&type=add&id=0&context=Odysee&cookiename=RetargetingPixel&age=44000&maxcookiecount=10"
          alt=""
        />
      </>
    );
  } else if (type === 'kill') {
    return (
      <>
        <img
          src="https://ctrack.trafficjunky.net/ctrack?action=list&type=add&id=0&context=Odysee&cookiename=KillPixel&age=0&maxcookiecount=10"
          alt=""
        />
      </>
    );
  } else {
    return null;
  }
};

export default Pixel;
