import Keycloak from 'keycloak-js';

// Setup Keycloak instance as needed
// Pass initialization options as required or leave blank to load from 'keycloak.json'
const keycloak = Keycloak({
  url: 'https://sso.odysee.com/auth',
  realm: 'Users',
  clientId: 'odysee.com',
  pkceMethod: 'S256',
  onLoad: 'check-sso',
  silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
});

export default keycloak;
