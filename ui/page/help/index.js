import HelpPage from './view';
import { connect } from 'react-redux';
import { doOpenModal } from 'redux/actions/app';
import { selectHomepageAnnouncement } from 'redux/selectors/settings';

const select = (state) => ({
  announcement: selectHomepageAnnouncement(state),
});

const perform = {
  doOpenModal,
};

export default connect(select, perform)(HelpPage);
