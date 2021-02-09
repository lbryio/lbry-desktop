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
  selectFetchingMyChannels,
} from 'lbry-redux';
import { doToast } from 'redux/actions/notifications';
import { selectActiveChannelClaim } from 'redux/selectors/app';
import RepostCreate from './view';

const select = (state, props) => ({
  channels: selectMyChannelClaims(state),
  claim: makeSelectClaimForUri(props.uri)(state),
  passedRepostClaim: makeSelectClaimForUri(props.name, false)(state),
  passedRepostAmount: makeSelectEffectiveAmountForUri(props.name)(state),
  enteredContentClaim: makeSelectClaimForUri(props.contentUri)(state),
  enteredRepostClaim: makeSelectClaimForUri(props.repostUri, false)(state),
  enteredRepostAmount: makeSelectEffectiveAmountForUri(props.repostUri)(state),
  title: makeSelectTitleForUri(props.uri)(state),
  balance: selectBalance(state),
  error: selectRepostError(state),
  reposting: selectRepostLoading(state),
  myClaims: selectMyClaimsWithoutChannels(state),
  isResolvingPassedRepost: props.name && makeSelectIsUriResolving(`lbry://${props.name}`)(state),
  isResolvingEnteredRepost: props.repostUri && makeSelectIsUriResolving(`lbry://${props.repostUri}`)(state),
  activeChannelClaim: selectActiveChannelClaim(state),
  fetchingMyChannels: selectFetchingMyChannels(state),
});

export default connect(select, {
  doHideModal,
  doRepost,
  doClearRepostError,
  doToast,
  doCheckPublishNameAvailability,
  doCheckPendingClaims,
})(RepostCreate);
