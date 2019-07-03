import { connect } from 'react-redux';
import {
  makeSelectPublishFormValue,
  selectIsStillEditing,
  selectMyClaimForUri,
  selectIsResolvingPublishUris,
  selectTakeOverAmount,
  doUpdatePublishForm,
  doPrepareEdit,
  selectBalance,
} from 'lbry-redux';

import PublishPage from './view';

const select = state => ({
  name: makeSelectPublishFormValue('name')(state),
  channel: makeSelectPublishFormValue('channel')(state),
  bid: makeSelectPublishFormValue('bid')(state),
  uri: makeSelectPublishFormValue('uri')(state),
  isStillEditing: selectIsStillEditing(state),
  isResolvingUri: selectIsResolvingPublishUris(state),
  amountNeededForTakeover: selectTakeOverAmount(state),
  balance: selectBalance(state),
  myClaimForUri: selectMyClaimForUri(state),
});

const perform = dispatch => ({
  updatePublishForm: value => dispatch(doUpdatePublishForm(value)),
  prepareEdit: (claim, uri) => dispatch(doPrepareEdit(claim, uri)),
});

export default connect(
  select,
  perform
)(PublishPage);
