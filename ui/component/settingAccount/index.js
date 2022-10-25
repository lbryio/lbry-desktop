import { connect } from 'react-redux';
import { selectHasChannels } from 'redux/selectors/claims';
import { selectWalletIsEncrypted } from 'redux/selectors/wallet';
import { doWalletStatus } from 'redux/actions/wallet';

import SettingAccount from './view';

const select = (state) => ({
  walletEncrypted: selectWalletIsEncrypted(state),
  hasChannels: selectHasChannels(state),
});

const perform = (dispatch) => ({
  doWalletStatus: () => dispatch(doWalletStatus()),
});

export default connect(select, perform)(SettingAccount);
