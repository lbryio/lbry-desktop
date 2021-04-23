import * as ACTIONS from 'constants/action_types';
import { getAuthToken } from 'util/saved-passwords';
import { doNotificationList } from 'redux/actions/notifications';

const NOTIFICATION_WS_URL = 'wss://sockety.lbry.com/ws/internal?id=';
const COMMENT_WS_URL = 'wss://sockety.lbry.com/ws/commentron?id=';

let sockets = {};
let closingSockets = {};
let retryCount = 0;

const getCommentSocketUrl = (claimId) => {
  return `${COMMENT_WS_URL}${claimId}&category=${claimId}`;
};

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

      sockets[url].onclose = () => {
        console.log('\n Disconnected from WS\n\n'); // eslint-disable-line
        if (!closingSockets[url]) {
          retryCount += 1;
          connectToSocket();
        } else {
          closingSockets[url] = null;
        }
      };
    }, timeToWait);
  }

  connectToSocket();
};

export const doSocketDisconnect = (url) => (dispatch) => {
  if (sockets[url] !== undefined && sockets[url] !== null) {
    closingSockets[url] = true;
    sockets[url].close();
    sockets[url] = null;

    dispatch({
      type: ACTIONS.WS_DISCONNECT,
    });
  }
};

export const doNotificationSocketConnect = (enableNotifications) => (dispatch) => {
  const authToken = getAuthToken();
  if (!authToken) {
    console.error('Unable to connect to web socket because auth token is missing'); // eslint-disable-line
    return;
  }

  const url = `${NOTIFICATION_WS_URL}${authToken}`;

  doSocketConnect(url, (data) => {
    switch (data.type) {
      case 'pending_notification':
        if (enableNotifications) {
          dispatch(doNotificationList());
        }
        break;
      case 'swap-status':
        dispatch({
          type: ACTIONS.COIN_SWAP_STATUS_RECEIVED,
          data: data.data,
        });
        break;
    }
  });
};

export const doCommentSocketConnect = (uri, claimId) => (dispatch) => {
  const url = getCommentSocketUrl(claimId);

  doSocketConnect(url, (response) => {
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
  const url = getCommentSocketUrl(claimId);

  dispatch(doSocketDisconnect(url));
};
