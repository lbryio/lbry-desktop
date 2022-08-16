// @flow
import React from 'react';

const GOOGLE_AD_URL = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';

let gExecutedOnce = false;

type Props = {
  doSetAdBlockerFound: (boolean) => void,
};

function AdBlockTester(props: Props) {
  const { doSetAdBlockerFound } = props;

  React.useEffect(() => {
    if (!gExecutedOnce) {
      fetch(GOOGLE_AD_URL)
        .then((response) => {
          doSetAdBlockerFound(response.redirected === true);
        })
        .catch(() => {
          doSetAdBlockerFound(true);
        })
        .finally(() => {
          gExecutedOnce = true;
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- on mount only
  }, []);

  return null;
}

export default AdBlockTester;
