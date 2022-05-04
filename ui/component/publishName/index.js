import { connect } from 'react-redux';
import { doUpdatePublishForm, doPrepareEdit } from 'redux/actions/publish';
import {
  makeSelectPublishFormValue,
  selectIsStillEditing,
  selectMyClaimForUri,
  selectTakeOverAmount,
  selectCurrentUploads,
} from 'redux/selectors/publish';
import { selectActiveChannelClaim, selectIncognito } from 'redux/selectors/app';
import PublishPage from './view';

const select = (state) => ({
  name: makeSelectPublishFormValue('name')(state),
  uri: makeSelectPublishFormValue('uri')(state),
  isStillEditing: selectIsStillEditing(state),
  myClaimForUri: selectMyClaimForUri(state),
  myClaimForUriCaseInsensitive: selectMyClaimForUri(state, false),
  currentUploads: selectCurrentUploads(state),
  activeChannelClaim: selectActiveChannelClaim(state),
  incognito: selectIncognito(state),
  amountNeededForTakeover: selectTakeOverAmount(state),
});

const perform = (dispatch) => ({
  updatePublishForm: (value) => dispatch(doUpdatePublishForm(value)),
  prepareEdit: (claim, uri) => dispatch(doPrepareEdit(claim, uri)),
});

export default connect(select, perform)(PublishPage);
