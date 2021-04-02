import * as ACTIONS from 'constants/action_types';
import { getAuthToken } from 'util/saved-passwords';
import { doNotificationList } from 'redux/actions/notifications';

const NOTIFICATION_WS_URL = 'wss://api.lbry.com/subscribe?auth_token=';
const COMMENT_WS_URL = `wss://comments.lbry.com/api/v2/live-chat/subscribe?subscription_id=`;

let sockets = {};
let retryCount = 0;

export const doSocketConnect = (url, retryOnDisconnect, cb) => {
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

      sockets[url].onclose = () => {
        console.log('\n Disconnected from WS\n\n'); // eslint-disable-line
        if (retryOnDisconnect) {
          retryCount += 1;
          connectToSocket();
        } else {
          sockets[url] = null;
        }
      };
    }, timeToWait);
  }

  connectToSocket();
};

export const doSocketDisconnect = (url) => (dispatch) => {
  if (sockets[url] !== undefined && sockets[url] !== null) {
    sockets[url].close();
    sockets[url] = null;

    dispatch({
      type: ACTIONS.WS_DISCONNECT,
    });
  }
};

export const doNotificationSocketConnect = () => (dispatch) => {
  const authToken = getAuthToken();
  if (!authToken) {
    console.error('Unable to connect to web socket because auth token is missing'); // eslint-disable-line
    return;
  }

  const url = `${NOTIFICATION_WS_URL}${authToken}`;

  doSocketConnect(url, true, (data) => {
    if (data.type === 'pending_notification') {
      dispatch(doNotificationList());
    }
  });
};

export const doCommentSocketConnect = (uri, claimId) => (dispatch) => {
  const url = `${COMMENT_WS_URL}${claimId}`;

  doSocketConnect(url, false, (response) => {
    if (response.type === 'delta') {
      const newComment = response.data.comment;
      dispatch({
        type: ACTIONS.COMMENT_RECEIVED,
        data: { comment: newComment, claimId, uri },
      });
    }
  });
};

export const doCommentSocketDisconnect = (claimId) => (dispatch) => {
  const url = `${COMMENT_WS_URL}${claimId}`;
  dispatch(doSocketDisconnect(url));
};
