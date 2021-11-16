import { connect } from 'react-redux';
import { doHideModal } from 'redux/actions/app';
import {
  makeSelectClaimForUri,
  selectTitleForUri,
  selectRepostError,
  selectRepostLoading,
  selectMyClaimsWithoutChannels,
  makeSelectEffectiveAmountForUri,
  selectIsUriResolving,
  selectFetchingMyChannels,
} from 'redux/selectors/claims';

import { selectBalance } from 'redux/selectors/wallet';
import {
  doRepost,
  doClearRepostError,
  doCheckPublishNameAvailability,
  doCheckPendingClaims,
} from 'redux/actions/claims';
import { doToast } from 'redux/actions/notifications';
import { selectActiveChannelClaim, selectIncognito } from 'redux/selectors/app';
import RepostCreate from './view';

const select = (state, props) => ({
  claim: makeSelectClaimForUri(props.uri)(state),
  passedRepostClaim: makeSelectClaimForUri(props.name, false)(state),
  passedRepostAmount: makeSelectEffectiveAmountForUri(props.name)(state),
  enteredContentClaim: makeSelectClaimForUri(props.contentUri)(state),
  enteredRepostClaim: makeSelectClaimForUri(props.repostUri, false)(state),
  enteredRepostAmount: makeSelectEffectiveAmountForUri(props.repostUri)(state),
  title: selectTitleForUri(state, props.uri),
  balance: selectBalance(state),
  error: selectRepostError(state),
  reposting: selectRepostLoading(state),
  myClaims: selectMyClaimsWithoutChannels(state),
  isResolvingPassedRepost: props.name && selectIsUriResolving(state, `lbry://${props.name}`),
  isResolvingEnteredRepost: props.repostUri && selectIsUriResolving(state, `lbry://${props.repostUri}`),
  activeChannelClaim: selectActiveChannelClaim(state),
  fetchingMyChannels: selectFetchingMyChannels(state),
  incognito: selectIncognito(state),
});

export default connect(select, {
  doHideModal,
  doRepost,
  doClearRepostError,
  doToast,
  doCheckPublishNameAvailability,
  doCheckPendingClaims,
})(RepostCreate);
