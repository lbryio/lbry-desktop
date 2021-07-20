import { connect } from 'react-redux';
import { doHideModal } from 'redux/actions/app';
import { doSetClientSetting } from 'redux/actions/settings';
import ModalAffirmPurchase from './view';

export default connect(null, {
  doHideModal,
  doSetClientSetting,
})(ModalAffirmPurchase);
