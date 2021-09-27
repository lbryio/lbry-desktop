import { connect } from 'react-redux';
import { doHideModal } from 'redux/actions/app';
import { selectIsMassClaimingTips, doTipClaimMass, selectUtxoCounts, selectTipsBalance } from 'lbry-redux';
import ModalSupportsLiquidate from './view';

const select = state => ({
  massClaimingTips: selectIsMassClaimingTips(state),
  utxoCounts: selectUtxoCounts(state),
  tipsBalance: selectTipsBalance(state) || 0,
});

export default connect(select, {
  doTipClaimMass,
  doHideModal,
})(ModalSupportsLiquidate);
