// @flow
import React from 'react';
import { SITE_NAME, LOGIN_IMG_URL } from 'config';

function LoginGraphic(props: any) {
  const alt = __('%SITE_NAME% login', { SITE_NAME });

  return (
    <div className="signup-image">
      <img alt={alt} src={LOGIN_IMG_URL} />
    </div>
  );
}

export default LoginGraphic;
