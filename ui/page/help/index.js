import HelpPage from './view';
import { connect } from 'react-redux';
import { doOpenModal } from 'redux/actions/app';
import { selectHomepageAnnouncement } from 'redux/selectors/settings';
import { selectUser } from 'redux/selectors/user';

const select = (state) => ({
  announcement: selectHomepageAnnouncement(state),
  user: selectUser(state),
});

const perform = {
  doOpenModal,
};

export default connect(select, perform)(HelpPage);
