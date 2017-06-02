import { getSession, setSession, setLocal } from './utils.js';
import lbry from './lbry.js';

const querystring = require('querystring');

const lbryio = {
	_accessToken: getSession('accessToken'),
	_authenticationPromise: null,
	_user: null,
	enabled: true
};

const CONNECTION_STRING = process.env.LBRY_APP_API_URL
	? process.env.LBRY_APP_API_URL.replace(/\/*$/, '/') // exactly one slash at the end
	: 'https://api.lbry.io/';
const EXCHANGE_RATE_TIMEOUT = 20 * 60 * 1000;

lbryio._exchangePromise = null;
lbryio._exchangeLastFetched = null;
lbryio.getExchangeRates = function() {
	if (
		!lbryio._exchangeLastFetched ||
		Date.now() - lbryio._exchangeLastFetched > EXCHANGE_RATE_TIMEOUT
	) {
		lbryio._exchangePromise = new Promise((resolve, reject) => {
			lbryio
				.call('lbc', 'exchange_rate', {}, 'get', true)
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

lbryio.call = function(
	resource,
	action,
	params = {},
	method = 'get',
	evenIfDisabled = false
) {
	// evenIfDisabled is just for development, when we may have some calls working and some not
	return new Promise((resolve, reject) => {
		if (
			!lbryio.enabled &&
			!evenIfDisabled &&
			(resource != 'discover' || action != 'list')
		) {
			console.log(__('Internal API disabled'));
			reject(new Error(__('LBRY internal API is disabled')));
			return;
		}

		const xhr = new XMLHttpRequest();

		xhr.addEventListener('error', function(event) {
			reject(
				new Error(__('Something went wrong making an internal API call.'))
			);
		});

		xhr.addEventListener('timeout', function() {
			reject(new Error(__('XMLHttpRequest connection timed out')));
		});

		xhr.addEventListener('load', function() {
			const response = JSON.parse(xhr.responseText);

			if (!response.success) {
				if (reject) {
					let error = new Error(response.error);
					error.xhr = xhr;
					reject(error);
				} else {
					document.dispatchEvent(
						new CustomEvent('unhandledError', {
							detail: {
								connectionString: connectionString,
								method: action,
								params: params,
								message: response.error.message,
								...(response.error.data ? { data: response.error.data } : {})
							}
						})
					);
				}
			} else {
				resolve(response.data);
			}
		});

		// For social media auth:
		//const accessToken = localStorage.getItem('accessToken');
		//const fullParams = {...params, ... accessToken ? {access_token: accessToken} : {}};

		// Temp app ID based auth:
		const fullParams = { app_id: lbryio.getAccessToken(), ...params };

		if (method == 'get') {
			xhr.open(
				'get',
				CONNECTION_STRING +
					resource +
					'/' +
					action +
					'?' +
					querystring.stringify(fullParams),
				true
			);
			xhr.send();
		} else if (method == 'post') {
			xhr.open('post', CONNECTION_STRING + resource + '/' + action, true);
			xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
			xhr.send(querystring.stringify(fullParams));
		} else {
			reject(new Error(__('Invalid method')));
		}
	});
};

lbryio.getAccessToken = () => {
	const token = getSession('accessToken');
	return token ? token.toString().trim() : token;
};

lbryio.setAccessToken = token => {
	setSession('accessToken', token ? token.toString().trim() : token);
};

lbryio.authenticate = function() {
  if (!lbryio.enabled) {
    return new Promise((resolve, reject) => {
      resolve({
        id: 1,
        has_verified_email: true
      })
    })
  }
  if (lbryio._authenticationPromise === null) {
    lbryio._authenticationPromise = new Promise((resolve, reject) => {
      lbry.status().then((response) => {

        let installation_id = response.installation_id.substring(0, response.installation_id.length - 2) + "E";

        function setCurrentUser() {
          lbryio.call('user', 'me').then((data) => {
              lbryio.user = data
              resolve(data)
          }).catch(function(err) {
            lbryio.setAccessToken(null);
            reject(err);
          })
        }

        if (!lbryio.getAccessToken()) {
          lbryio.call('user', 'new', {
            language: 'en',
            app_id: installation_id,
          }, 'post').then(function(responseData) {
            if (!responseData.id) {
              reject(new Error("Received invalid authentication response."));
            }
            lbryio.setAccessToken(installation_id)
            setLocal('auth_bypassed', false)
            setCurrentUser()
          }).catch(function(error) {
            	/*
               until we have better error code format, assume all errors are duplicate application id
               if we're wrong, this will be caught by later attempts to make a valid call
             	*/
							lbryio.setAccessToken(installation_id);
							setCurrentUser();
						});
					} else {
						setCurrentUser();
					}
				})
				.catch(reject);
		});
	}
	return lbryio._authenticationPromise;
};

export default lbryio;
