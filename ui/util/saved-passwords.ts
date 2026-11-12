import { DOMAIN } from "config";
const AUTH_TOKEN = "auth_token";
const SAVED_PASSWORD = "saved_password";
const domain =
  typeof window === "object" && window.location.hostname.includes("localhost") ? window.location.hostname : DOMAIN;
const isProduction = process.env.NODE_ENV === "production";
const maxExpiration = 2147483647;
let sessionPassword: string;

function setCookie(name: string, value: string, expirationDaysOnWeb?: number): void {
  let expires = "";
  if (expirationDaysOnWeb) {
    const date = new Date();
    date.setTime(date.getTime() + expirationDaysOnWeb * 24 * 60 * 60 * 1000);
    // If on PC, set to not expire (max)
    expires = `expires=${maxExpiration};`;
  }

  let cookie = `${name}=${value || ""}; ${expires} path=/;`;
  if (isProduction) {
    cookie += ` SameSite=None;`;
  }
  if (!isProduction) {
    cookie += ` SameSite=Lax;`;
  }
  if (isProduction) {
    cookie += ` domain=${domain}; Secure;`;
  }

  document.cookie = cookie;
}

function getCookie(name: string): string | null {
  const nameEQ = name + "=";
  const cookies = document.cookie.split(";");

  for (let i = 0; i < cookies.length; i++) {
    let cookie = cookies[i];
    while (cookie.charAt(0) === " ") {
      cookie = cookie.substring(1, cookie.length);
    }

    if (cookie.indexOf(nameEQ) === 0) {
      return cookie.substring(nameEQ.length, cookie.length);
    }
  }
  return null;
}

function deleteCookie(name: string): void {
  document.cookie = name + `=; Max-Age=-99999999; domain=${domain}; path=/;`;

  // Legacy
  // Adding this here to delete any old cookies before we removed the "." in front of the domain
  // Remove this if you see it after March 11th, 2021
  // https://github.com/lbryio/lbry-desktop/pull/3830
  document.cookie = name + `=; Max-Age=-99999999; domain=.${domain}; path=/;`;
}

function setSavedPassword(value: string | null | undefined, saveToDisk: boolean): Promise<void> {
  return new Promise<void>((resolve) => {
    const password = value === undefined || value === null ? "" : value;
    sessionPassword = password;

    if (saveToDisk) {
      if (password) {
        setCookie(SAVED_PASSWORD, password, 14);
      } else {
        deleteSavedPassword();
      }
    }

    // Nothing here is asynchronous, but callers get a Promise, so settle it (#713).
    resolve();
  });
}

function getSavedPassword(): Promise<string> {
  return new Promise<string>((resolve) => {
    if (sessionPassword) {
      resolve(sessionPassword);
    }

    return getPasswordFromCookie().then((p) => resolve(p));
  });
}

function getPasswordFromCookie(): Promise<string> {
  return new Promise<string>((resolve) => {
    let password: string;
    password = getCookie(SAVED_PASSWORD);
    resolve(password);
  });
}

function deleteSavedPassword(): Promise<void> {
  return new Promise<void>((resolve) => {
    deleteCookie(SAVED_PASSWORD);
    resolve();
  });
}

function getAuthToken(): string | null {
  return getCookie(AUTH_TOKEN);
}

function setAuthToken(value: string): void {
  return setCookie(AUTH_TOKEN, value, 365);
}

function deleteAuthToken(): Promise<void> {
  return new Promise<void>((resolve) => {
    deleteCookie(AUTH_TOKEN);
    resolve();
  });
}

function doSignOutCleanup(): Promise<void> {
  return new Promise<void>((resolve) => {
    deleteAuthToken();
    deleteSavedPassword();
    resolve();
  });
}

function doAuthTokenRefresh(): void {
  const authToken = getAuthToken();
  if (authToken) {
    deleteAuthToken();
    setAuthToken(authToken);
  }
}

export {
  setSavedPassword,
  getSavedPassword,
  getPasswordFromCookie,
  deleteSavedPassword,
  getAuthToken,
  setAuthToken,
  deleteAuthToken,
  doSignOutCleanup,
  doAuthTokenRefresh,
};
