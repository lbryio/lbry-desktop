import { connect } from 'react-redux';
import { selectPublishFormValue } from 'redux/selectors/publish';
import { doUpdatePublishForm } from 'redux/actions/publish';
import { doCustomerPurchaseCost, doTipAccountStatus } from 'redux/actions/stripe';
import { selectAccountChargesEnabled } from 'redux/selectors/stripe';
import PublishPrice from './view';

const select = (state) => ({
  fileMime: selectPublishFormValue(state, 'fileMime'),
  streamType: selectPublishFormValue(state, 'streamType'),
  isMarkdownPost: selectPublishFormValue(state, 'isMarkdownPost'),
  paywall: selectPublishFormValue(state, 'paywall'),
  fiatPurchaseEnabled: selectPublishFormValue(state, 'fiatPurchaseEnabled'),
  fiatPurchaseFee: selectPublishFormValue(state, 'fiatPurchaseFee'),
  fiatRentalEnabled: selectPublishFormValue(state, 'fiatRentalEnabled'),
  fiatRentalFee: selectPublishFormValue(state, 'fiatRentalFee'),
  fiatRentalExpiration: selectPublishFormValue(state, 'fiatRentalExpiration'),
  fee: selectPublishFormValue(state, 'fee'),
  chargesEnabled: selectAccountChargesEnabled(state),
  restrictedToMemberships: selectPublishFormValue(state, 'restrictedToMemberships'),
});

const perform = {
  updatePublishForm: doUpdatePublishForm,
  doTipAccountStatus,
  doCustomerPurchaseCost,
};

export default connect(select, perform)(PublishPrice);
