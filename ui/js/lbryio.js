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
  return new Promise((resolve, reject) => {
    if (!lbryio.enabled && (resource != "discover" || action != "list")) {
      console.log(__("Internal API disabled"));
      reject(new Error(__("LBRY internal API is disabled")));
      return;
    }

    const xhr = new XMLHttpRequest();

    xhr.addEventListener("error", function(event) {
      reject(
        new Error(__("Something went wrong making an internal API call."))
      );
    });

    xhr.addEventListener("timeout", function() {
      reject(new Error(__("XMLHttpRequest connection timed out")));
    });

    xhr.addEventListener("load", function() {
      const response = JSON.parse(xhr.responseText);

      if (!response.success) {
        if (reject) {
          const error = new Error(response.error);
          error.xhr = xhr;
          reject(error);
        } else {
          document.dispatchEvent(
            new CustomEvent("unhandledError", {
              detail: {
                connectionString: connectionString,
                method: action,
                params: params,
                message: response.error.message,
                ...(response.error.data ? { data: response.error.data } : {}),
              },
            })
          );
        }
      } else {
        resolve(response.data);
      }
    });

    lbryio
      .getAuthToken()
      .then(token => {
        const fullParams = { auth_token: token, ...params };

        if (method == "get") {
          xhr.open(
            "get",
            CONNECTION_STRING +
              resource +
              "/" +
              action +
              "?" +
              querystring.stringify(fullParams),
            true
          );
          xhr.send();
        } else if (method == "post") {
          xhr.open("post", CONNECTION_STRING + resource + "/" + action, true);
          xhr.setRequestHeader(
            "Content-type",
            "application/x-www-form-urlencoded"
          );
          xhr.send(querystring.stringify(fullParams));
        } else {
          reject(new Error(__("Invalid method")));
        }
      })
      .catch(reject);
  });
};

lbryio.getAuthToken = () => {
  return new Promise((resolve, reject) => {
    ipcRenderer.once("auth-token-response", (event, token) => {
      return resolve(token);
    });
    ipcRenderer.send("get-auth-token");
  });
};

lbryio.setAuthToken = token => {
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
        has_email: true,
        has_verified_email: true,
        is_reward_approved: false,
        is_reward_eligible: false,
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

          let app_id;

          return lbry
            .status()
            .then(status => {
              // first try swapping
              app_id = status.installation_id;
              return lbryio.call(
                "user",
                "token_swap",
                { auth_token: "", app_id: app_id },
                "post"
              );
            })
            .catch(err => {
              if (err.xhr.status == 403) {
                // cannot swap. either app_id doesn't exist, or app_id already swapped. pretend its the former and create a new user. if we get another error, then its the latter
                return lbryio.call(
                  "user",
                  "new",
                  { auth_token: "", language: "en", app_id: app_id },
                  "post"
                );
              }
              throw err;
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

export default lbryio;
