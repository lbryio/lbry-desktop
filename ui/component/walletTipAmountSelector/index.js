import { connect } from 'react-redux';
import { selectBalance } from 'redux/selectors/wallet';
import WalletTipAmountSelector from './view';
import { selectUserVerifiedEmail } from 'redux/selectors/user';

const select = (state, props) => ({
  balance: selectBalance(state),
  isAuthenticated: Boolean(selectUserVerifiedEmail(state)),
  // claim: makeSelectClaimForUri(props.uri)(state),
  // claim: makeSelectClaimForUri(props.uri, false)(state),
});

export default connect(select)(WalletTipAmountSelector);
