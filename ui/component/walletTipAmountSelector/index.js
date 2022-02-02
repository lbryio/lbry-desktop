import { connect } from 'react-redux';
import { selectBalance } from 'redux/selectors/wallet';
import { selectClaimForUri } from 'redux/selectors/claims';
import WalletTipAmountSelector from './view';

const select = (state, props) => ({
  balance: selectBalance(state),
  claim: selectClaimForUri(state, props.uri),
});

export default connect(select)(WalletTipAmountSelector);
