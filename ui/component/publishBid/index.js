import { connect } from 'react-redux';
import {
  makeSelectPublishFormValue,
  selectMyClaimForUri,
  selectIsResolvingPublishUris,
  selectTakeOverAmount,
  doUpdatePublishForm,
  doPrepareEdit,
  selectBalance,
} from 'lbry-redux';
import PublishPage from './view';

const select = (state) => ({
  name: makeSelectPublishFormValue('name')(state),
  bid: makeSelectPublishFormValue('bid')(state),
  uri: makeSelectPublishFormValue('uri')(state),
  isResolvingUri: selectIsResolvingPublishUris(state),
  balance: selectBalance(state),
  myClaimForUri: selectMyClaimForUri(state),
  amountNeededForTakeover: selectTakeOverAmount(state),
});

const perform = (dispatch) => ({
  updatePublishForm: (value) => dispatch(doUpdatePublishForm(value)),
  prepareEdit: (claim, uri) => dispatch(doPrepareEdit(claim, uri)),
});

export default connect(select, perform)(PublishPage);
