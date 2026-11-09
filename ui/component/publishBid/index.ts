//@ts-nocheck
import {connect} from 'react-redux';
import { selectBalance } from 'redux/selectors/wallet';
import {
  makeSelectPublishFormValue,
  selectMyClaimForUri,
  selectIsResolvingPublishUris,
  selectTakeOverAmount,
} from 'redux/selectors/publish';
import { doUpdatePublishForm, doPrepareEdit } from 'redux/actions/publish';
import PublishPage from './view';

const select = (state: unknown) => ({
  name: makeSelectPublishFormValue('name')(state),
  bid: makeSelectPublishFormValue('bid')(state),
  uri: makeSelectPublishFormValue('uri')(state),
  isResolvingUri: selectIsResolvingPublishUris(state),
  balance: selectBalance(state),
  myClaimForUri: selectMyClaimForUri(state),
  amountNeededForTakeover: selectTakeOverAmount(state),
});

const perform = (dispatch: unknown) => ({
  updatePublishForm: (value) => dispatch(doUpdatePublishForm(value)),
  prepareEdit: (claim, uri) => dispatch(doPrepareEdit(claim, uri)),
});

export default connect(select, perform)(PublishPage);
