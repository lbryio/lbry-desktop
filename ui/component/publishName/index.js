import { connect } from 'react-redux';
import {
  makeSelectPublishFormValue,
  selectIsStillEditing,
  selectMyClaimForUri,
  selectTakeOverAmount,
  doUpdatePublishForm,
  doPrepareEdit,
} from 'lbry-redux';
import { selectActiveChannelClaim, selectIncognito } from 'redux/selectors/app';
import { doSetActiveChannel } from 'redux/actions/app';
import PublishPage from './view';

const select = (state) => ({
  name: makeSelectPublishFormValue('name')(state),
  uri: makeSelectPublishFormValue('uri')(state),
  isStillEditing: selectIsStillEditing(state),
  myClaimForUri: selectMyClaimForUri(state),
  activeChannelClaim: selectActiveChannelClaim(state),
  incognito: selectIncognito(state),
  amountNeededForTakeover: selectTakeOverAmount(state),
});

const perform = (dispatch) => ({
  updatePublishForm: (value) => dispatch(doUpdatePublishForm(value)),
  prepareEdit: (claim, uri) => dispatch(doPrepareEdit(claim, uri)),
  setActiveChannel: (claimId) => dispatch(doSetActiveChannel(claimId)),
});

export default connect(select, perform)(PublishPage);
