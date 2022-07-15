import { connect } from 'react-redux';
import { selectBalance } from 'redux/selectors/wallet';
import { selectClaimForUri } from 'redux/selectors/claims';
import WalletTipAmountSelector from './view';
import { selectClientSetting } from 'redux/selectors/settings';
import * as SETTINGS from 'constants/settings';

const select = (state, props) => ({
  balance: selectBalance(state),
  claim: selectClaimForUri(state, props.uri),
  preferredCurrency: selectClientSetting(state, SETTINGS.PREFERRED_CURRENCY),
});

export default connect(select)(WalletTipAmountSelector);
