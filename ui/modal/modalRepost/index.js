import { connect } from 'react-redux';
import { doHideModal } from 'redux/actions/app';
import {
  makeSelectClaimForUri,
  makeSelectTitleForUri,
  selectBalance,
  selectMyChannelClaims,
  doRepost,
  selectRepostError,
  selectRepostLoading,
  doClearRepostError,
  selectMyClaimsWithoutChannels,
  doCheckPublishNameAvailability,
} from 'lbry-redux';
import { doToast } from 'redux/actions/notifications';
import ModalRepost from './view';

const select = (state, props) => ({
  channels: selectMyChannelClaims(state),
  claim: makeSelectClaimForUri(props.uri)(state),
  title: makeSelectTitleForUri(props.uri)(state),
  balance: selectBalance(state),
  error: selectRepostError(state),
  reposting: selectRepostLoading(state),
  myClaims: selectMyClaimsWithoutChannels(state),
});

export default connect(select, {
  doHideModal,
  doRepost,
  doClearRepostError,
  doToast,
  doCheckPublishNameAvailability,
})(ModalRepost);
