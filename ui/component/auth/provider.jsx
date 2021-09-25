// @flow
import * as React from 'react';
import { ReactKeycloakProvider, useKeycloak } from '@react-keycloak/web';
import keycloak from 'util/keycloak';
import type { Node } from 'react';
import {
  getTokens,
} from 'util/saved-passwords';

type Props = {
  children: Node,
};

export const AuthProvider = (props: Props) => {
  const { children } = props;
  const tokens = getTokens();

  const eventLogger = (event, error) => {
    console.log('onKeycloakEvent', event, error, keycloak);
    // if (event === 'onReady') {
    //   setKeycloakReady(true);
    // }
  };
  if (keycloak && tokens.access_token) {
    return (
      <ReactKeycloakProvider
        authClient={keycloak}
        onEvent={eventLogger}
        initOptions={
          { onLoad: 'check-sso',
            silentCheckSsoFallback: false,
            redirectUri: 'http://localhost:9090/'}
        } // from npmjs docs for @react-keycloak/web
      >
        {children}
      </ReactKeycloakProvider>
    );
  } else {
    return (
      <>{children}</>
    );
  }
};

export default AuthProvider;
