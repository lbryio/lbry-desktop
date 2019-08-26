import keytar from 'keytar';
import { AUTH_ORG } from 'constants/keychain';

export const setSavedPassword = (key, value) => {
  keytar.setPassword(AUTH_ORG, key, value);
};

export const getSavedPassword = key => {
  return keytar
    .getPassword(AUTH_ORG, key)
    .then(p => p)
    .catch(e => console.error(e));
};

export const deleteSavedPassword = key => keytar.deletePassword(AUTH_ORG, key).catch(e => console.error(e));
