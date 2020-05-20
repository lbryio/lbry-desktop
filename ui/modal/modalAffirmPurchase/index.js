import { connect } from 'react-redux';
import { doSetPlayingUri, doPlayUri } from 'redux/actions/content';
import { doHideModal } from 'redux/actions/app';
import { makeSelectMetadataForUri } from 'lbry-redux';
import { doClaimRewardType, rewards as REWARDS } from 'lbryinc';
import ModalAffirmPurchase from './view';

const select = (state, props) => ({
  metadata: makeSelectMetadataForUri(props.uri)(state),
});

const perform = dispatch => ({
  cancelPurchase: () => {
    dispatch(doSetPlayingUri(null));
    dispatch(doHideModal());
  },
  closeModal: () => dispatch(doHideModal()),
  loadVideo: (uri, onSuccess) => dispatch(doPlayUri(uri, true, undefined, onSuccess)),
  claimReward: txid =>
    dispatch(
      doClaimRewardType(REWARDS.TYPE_PAID_CONTENT, {
        failSilently: true,
        params: { transaction_id: txid },
      })
    ),
});

export default connect(select, perform)(ModalAffirmPurchase);
