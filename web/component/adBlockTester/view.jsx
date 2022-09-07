// @flow
import React from 'react';

const TRIGGER_CLASS = 'pub_300x250 pub_300x250m pub_728x90 text-ad textAd text_ad text_ads text-ads adamazon';

// ****************************************************************************
// ****************************************************************************

type Props = {
  doSetAdBlockerFound: (boolean) => void,
};

function AdBlockTester(props: Props) {
  const { doSetAdBlockerFound } = props;
  const ref = React.useRef();

  React.useEffect(() => {
    if (ref.current) {
      const mountedStyle = getComputedStyle(ref.current);
      doSetAdBlockerFound(mountedStyle?.display === 'none');
    }
  }, [doSetAdBlockerFound]);

  return (
    <div
      ref={ref}
      className={TRIGGER_CLASS}
      style={{ height: '1px', width: '1px', position: 'absolute', left: '-1px', top: '-1px' }}
    />
  );
}

export default AdBlockTester;
