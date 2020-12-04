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
  doCheckPendingClaims,
  makeSelectEffectiveAmountForUri,
  makeSelectIsUriResolving,
} from 'lbry-redux';
import { doToast } from 'redux/actions/notifications';
import RepostCreate from './view';

const select = (state, props) => ({
  channels: selectMyChannelClaims(state),
  claim: makeSelectClaimForUri(props.uri)(state),
  passedRepostClaim: makeSelectClaimForUri(props.name)(state),
  passedRepostAmount: makeSelectEffectiveAmountForUri(props.name)(state),
  enteredContentClaim: makeSelectClaimForUri(props.contentUri)(state),
  enteredRepostClaim: makeSelectClaimForUri(props.repostUri)(state),
  enteredRepostAmount: makeSelectEffectiveAmountForUri(props.repostUri)(state),
  title: makeSelectTitleForUri(props.uri)(state),
  balance: selectBalance(state),
  error: selectRepostError(state),
  reposting: selectRepostLoading(state),
  myClaims: selectMyClaimsWithoutChannels(state),
  isResolvingPassedRepost: props.name && makeSelectIsUriResolving(`lbry://${props.name}`)(state),
  isResolvingEnteredRepost: props.repostUri && makeSelectIsUriResolving(`lbry://${props.repostUri}`)(state),
});

export default connect(select, {
  doHideModal,
  doRepost,
  doClearRepostError,
  doToast,
  doCheckPublishNameAvailability,
  doCheckPendingClaims,
})(RepostCreate);
