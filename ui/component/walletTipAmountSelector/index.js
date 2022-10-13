import { connect } from 'react-redux';
import { selectBalance } from 'redux/selectors/wallet';
import { selectClaimForUri } from 'redux/selectors/claims';
import WalletTipAmountSelector from './view';
import { selectPreferredCurrency } from 'redux/selectors/settings';
import { selectCanReceiveFiatTipsForUri } from 'redux/selectors/stripe';
import { doTipAccountCheckForUri } from 'redux/actions/stripe';

const select = (state, props) => {
  const { uri } = props;

  return {
    balance: selectBalance(state),
    claim: selectClaimForUri(state, uri),
    preferredCurrency: selectPreferredCurrency(state),
    canReceiveFiatTips: selectCanReceiveFiatTipsForUri(state, uri),
  };
};

const perform = {
  doTipAccountCheckForUri,
};

export default connect(select, perform)(WalletTipAmountSelector);
