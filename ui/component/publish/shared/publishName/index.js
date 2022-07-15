import { connect } from 'react-redux';
import { doUpdatePublishForm, doPrepareEdit } from 'redux/actions/publish';
import {
  selectPublishFormValue,
  selectIsStillEditing,
  selectMyClaimForUri,
  selectTakeOverAmount,
  selectCurrentUploads,
} from 'redux/selectors/publish';
import { selectActiveChannelClaim, selectIncognito } from 'redux/selectors/app';
import PublishName from './view';

const select = (state) => ({
  name: selectPublishFormValue(state, 'name'),
  uri: selectPublishFormValue(state, 'uri'),
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

export default connect(select, perform)(PublishName);
