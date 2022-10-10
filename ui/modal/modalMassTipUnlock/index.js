import { connect } from 'react-redux';
import { doHideModal } from 'redux/actions/app';
import { doTipClaimMass } from 'redux/actions/wallet';
import { selectIsMassClaimingTips, selectUtxoCounts, selectTipsBalance } from 'redux/selectors/wallet';
import ModalSupportsLiquidate from './view';

const select = (state) => ({
  massClaimingTips: selectIsMassClaimingTips(state),
  utxoCounts: selectUtxoCounts(state),
  tipsBalance: selectTipsBalance(state) || 0,
});

export default connect(select, {
  doTipClaimMass,
  doHideModal,
})(ModalSupportsLiquidate);
