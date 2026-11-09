//@ts-nocheck
import {connect} from 'react-redux';
import { selectBalance } from 'redux/selectors/wallet';
import Wallet from './view';

const select = (state: unknown) => ({
  balance: selectBalance(state),
});

export default connect(select, {})(Wallet);
