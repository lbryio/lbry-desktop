// @flow
import React from 'react';
import { SIMPLE_SITE } from 'config';
type Props = {
  type: string,
};

const Pixel = (props: Props) => {
  const { type } = props;
  if (!SIMPLE_SITE) {
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
