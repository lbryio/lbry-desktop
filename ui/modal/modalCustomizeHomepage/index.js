import { connect } from 'react-redux';
import ModalCustomizeHomepage from './view';
import * as SETTINGS from 'constants/settings';
import { doHideModal, doOpenModal } from 'redux/actions/app';
import { doToast } from 'redux/actions/notifications';
import { doSetClientSetting } from 'redux/actions/settings';
import { selectClientSetting } from 'redux/selectors/settings';
import { selectHasOdyseeMembership } from 'redux/selectors/user';

const select = (state) => ({
  hasMembership: selectHasOdyseeMembership(state),
  homepageOrder: selectClientSetting(state, SETTINGS.HOMEPAGE_ORDER),
});

const perform = {
  doSetClientSetting,
  doToast,
  doOpenModal,
  doHideModal,
};

export default connect(select, perform)(ModalCustomizeHomepage);
