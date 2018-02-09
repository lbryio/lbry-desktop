import * as MODALS from 'constants/modal-types'; 
import { connect } from 'react-redux';
import {
  ACTIONS,
  doOpenModal,
  doSendSupport,
  doShowSnackBar,
  makeSelectTitleForUri,
  selectIsSendingSupport
} from 'lbry-redux';
import WalletSendTip from './view';

const sendSupportSuccessCallback = results => {
  if (results.txid) {
    dispatch({
      type: ACTIONS.SUPPORT_TRANSACTION_COMPLETED,
    });
    dispatch(
      doShowSnackBar({
        message: __(`You sent ${amount} LBC as support, Mahalo!`),
        linkText: __('History'),
        linkTarget: __('/wallet'),
      })
    );
    dispatch(doNavigate('/show', { uri }));
  } else {
    dispatch({
      type: ACTIONS.SUPPORT_TRANSACTION_FAILED,
      data: { error: results.code },
    });
    dispatch(doOpenModal(MODALS.TRANSACTION_FAILED));
  }
};

const sendSupportErrorCallback = error => {
  dispatch({
    type: ACTIONS.SUPPORT_TRANSACTION_FAILED,
    data: { error: error.code },
  });
  dispatch(doOpenModal(MODALS.TRANSACTION_FAILED));
};

const select = (state, props) => ({
  isPending: selectIsSendingSupport(state),
  title: makeSelectTitleForUri(props.uri)(state),
});

const perform = dispatch => ({
  // TODO: Add success and error callbacks for sendSupport
  sendSupport: (amount, claimId, uri) => dispatch(doSendSupport(
    amount, claimId, uri, sendSupportSuccessCallback, sendSupportErrorCallback)),
});

export default connect(select, perform)(WalletSendTip);
