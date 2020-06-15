import { connect } from 'react-redux';
import { doOpenModal } from 'redux/actions/app';
import { selectUser } from 'redux/selectors/user';
import YoutubeWelcome from './view';

const select = state => ({
  user: selectUser(state),
});

export default connect(select, {
  doOpenModal,
})(YoutubeWelcome);
