// @flow
import React from 'react';
import { SITE_NAME, LOGIN_IMG_URL } from 'config';

function LoginGraphic(props: any) {
  const [error, setError] = React.useState(false);
  const src = LOGIN_IMG_URL;

  return error || !src ? null : (
    <div className="signup-image">
      <img alt={__('%SITE_NAME% login image', { SITE_NAME })} src={src} onError={() => setError(true)} />
    </div>
  );
}

export default LoginGraphic;
