import * as ACTIONS from 'constants/action_types';
import { getAuthToken } from 'util/saved-passwords';
import { doNotificationList } from 'redux/actions/notifications';

let sockets = {};
let retryCount = 0;

export const doSocketConnect = (url, cb) => {
  function connectToSocket() {
    if (sockets[url] !== undefined && sockets[url] !== null) {
      sockets[url].close();
      sockets[url] = null;
    }

    const timeToWait = retryCount ** 2 * 1000;
    setTimeout(() => {
      sockets[url] = new WebSocket(url);
      sockets[url].onopen = (e) => {
        retryCount = 0;
        console.log('\nConnected to WS \n\n'); // eslint-disable-line
      };
      sockets[url].onmessage = (e) => {
        const data = JSON.parse(e.data);
        cb(data);
      };

      sockets[url].onerror = (e) => {
        console.error('websocket onerror', e); // eslint-disable-line
        // onerror and onclose will both fire, so nothing is needed here
      };

      sockets[url].onclose = (e) => {
        console.error('websocket onclose', e); // eslint-disable-line
        retryCount += 1;
        connectToSocket();
      };
    }, timeToWait);
  }

  connectToSocket();
};

export const doNotificationSocketConnect = () => (dispatch) => {
  const authToken = getAuthToken();
  if (!authToken) {
    console.error('Unable to connect to web socket because auth token is missing'); // eslint-disable-line
    return;
  }

  const url = `wss://api.lbry.com/subscribe?auth_token=${authToken}`;
  doSocketConnect(url, (data) => {
    if (data.type === 'pending_notification') {
      dispatch(doNotificationList());
    }
  });
};

export const doCommentSocketConnect = (claimId) => (dispatch) => {
  const url = `wss://comments.lbry.com/api/v2/live-chat/subscribe?subscription_id=${claimId}`;

  doSocketConnect(url, (response) => {
    if (response.type === 'delta') {
      const newComment = response.data.comment;
      dispatch({
        type: ACTIONS.COMMENT_RECEIVED,
        data: { comment: newComment, claimId },
      });
    }
  });
};

export const doSocketDisconnect = () => ({
  type: ACTIONS.WS_DISCONNECT,
});
