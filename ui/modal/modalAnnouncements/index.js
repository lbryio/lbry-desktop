import ModalAnnouncements from './view';
import { connect } from 'react-redux';
import { doHideModal } from 'redux/actions/app';
import { doSetLastViewedAnnouncement } from 'redux/actions/content';
import { selectLastViewedAnnouncement } from 'redux/selectors/content';
import { selectHomepageAnnouncement } from 'redux/selectors/settings';
import { selectUserVerifiedEmail } from 'redux/selectors/user';

const select = (state) => ({
  authenticated: selectUserVerifiedEmail(state),
  announcement: selectHomepageAnnouncement(state),
  lastViewedHash: selectLastViewedAnnouncement(state),
});

const perform = {
  doHideModal,
  doSetLastViewedAnnouncement,
};

export default connect(select, perform)(ModalAnnouncements);
