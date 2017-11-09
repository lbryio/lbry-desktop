import lbry from "./lbry.js";

const querystring = require("querystring");
const { ipcRenderer } = require("electron");

const lbryio = {
  enabled: true,
  _authenticationPromise: null,
  _exchangePromise: null,
  _exchangeLastFetched: null,
};

const CONNECTION_STRING = process.env.LBRY_APP_API_URL
  ? process.env.LBRY_APP_API_URL.replace(/\/*$/, "/") // exactly one slash at the end
  : "https://api.lbry.io/";

const EXCHANGE_RATE_TIMEOUT = 20 * 60 * 1000;

lbryio.getExchangeRates = function() {
  if (
    !lbryio._exchangeLastFetched ||
    Date.now() - lbryio._exchangeLastFetched > EXCHANGE_RATE_TIMEOUT
  ) {
    lbryio._exchangePromise = new Promise((resolve, reject) => {
      lbryio
        .call("lbc", "exchange_rate", {}, "get", true)
        .then(({ lbc_usd, lbc_btc, btc_usd }) => {
          const rates = { lbc_usd, lbc_btc, btc_usd };
          resolve(rates);
        })
        .catch(reject);
    });
    lbryio._exchangeLastFetched = Date.now();
  }
  return lbryio._exchangePromise;
};

lbryio.call = function(resource, action, params = {}, method = "get") {
  if (!lbryio.enabled) {
    console.log(__("Internal API disabled"));
    return Promise.reject(new Error(__("LBRY internal API is disabled")));
  }

  if (!(method == "get" || method == "post")) {
    return Promise.reject(new Error(__("Invalid method")));
  }

  function checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
      return response;
    } else {
      var error = new Error(response.statusText);
      error.response = response;
      throw error;
    }
  }

  function parseJSON(response) {
    return response.json();
  }

  function makeRequest(url, options) {
    return fetch(url, options).then(checkStatus).then(parseJSON).catch(e => {
      throw e;
    });
  }

  return lbryio.getAuthToken().then(token => {
    const fullParams = { auth_token: token, ...params };
    const qs = querystring.stringify(fullParams);
    let url = `${CONNECTION_STRING}${resource}/${action}?${qs}`;

    let options = {
      method: "GET",
    };

    if (method == "post") {
      options = {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs,
      };
      url = `${CONNECTION_STRING}${resource}/${action}`;
    }

    return makeRequest(url, options).then(response => response.data);
  });
};

lbryio._authToken = null;

lbryio.getAuthToken = () => {
  return new Promise((resolve, reject) => {
    if (lbryio._authToken) {
      resolve(lbryio._authToken);
    } else {
      ipcRenderer.once("auth-token-response", (event, token) => {
        lbryio._authToken = token;
        return resolve(token);
      });
      ipcRenderer.send("get-auth-token");
    }
  });
};

lbryio.setAuthToken = token => {
  lbryio._authToken = token ? token.toString().trim() : null;
  ipcRenderer.send("set-auth-token", token);
};

lbryio.getCurrentUser = () => {
  return lbryio.call("user", "me");
};

lbryio.authenticate = function() {
  if (!lbryio.enabled) {
    return new Promise((resolve, reject) => {
      resolve({
        id: 1,
        language: "en",
        primary_email: "disabled@lbry.io",
        has_verified_email: true,
        is_identity_verified: true,
        is_reward_approved: false,
      });
    });
  }

  if (lbryio._authenticationPromise === null) {
    lbryio._authenticationPromise = new Promise((resolve, reject) => {
      lbryio
        .getAuthToken()
        .then(token => {
          if (!token || token.length > 60) {
            return false;
          }

          // check that token works
          return lbryio
            .getCurrentUser()
            .then(() => {
              return true;
            })
            .catch(() => {
              return false;
            });
        })
        .then(isTokenValid => {
          if (isTokenValid) {
            return;
          }

          return lbry
            .status()
            .then(status => {
              return lbryio.call(
                "user",
                "new",
                {
                  auth_token: "",
                  language: "en",
                  app_id: status.installation_id,
                },
                "post"
              );
            })
            .then(response => {
              if (!response.auth_token) {
                throw new Error(__("auth_token is missing from response"));
              }
              return lbryio.setAuthToken(response.auth_token);
            });
        })
        .then(lbryio.getCurrentUser)
        .then(resolve, reject);
    });
  }

  return lbryio._authenticationPromise;
};

lbryio.getStripeToken = () => {
  return CONNECTION_STRING.startsWith("http://localhost:")
    ? "pk_test_NoL1JWL7i1ipfhVId5KfDZgo"
    : "pk_live_e8M4dRNnCCbmpZzduEUZBgJO";
};

export default lbryio;
