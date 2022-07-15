import { connect } from 'react-redux';
import { selectBalance } from 'redux/selectors/wallet';
import {
  selectPublishFormValue,
  selectMyClaimForUri,
  selectIsResolvingPublishUris,
  selectTakeOverAmount,
} from 'redux/selectors/publish';
import { doUpdatePublishForm } from 'redux/actions/publish';
import PublishBid from './view';

const select = (state) => ({
  name: selectPublishFormValue(state, 'name'),
  bid: selectPublishFormValue(state, 'bid'),
  isResolvingUri: selectIsResolvingPublishUris(state),
  balance: selectBalance(state),
  myClaimForUri: selectMyClaimForUri(state),
  amountNeededForTakeover: selectTakeOverAmount(state),
});

const perform = (dispatch) => ({
  updatePublishForm: (value) => dispatch(doUpdatePublishForm(value)),
});

export default connect(select, perform)(PublishBid);
