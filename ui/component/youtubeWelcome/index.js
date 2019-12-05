import { connect } from 'react-redux';
import { doOpenModal } from 'redux/actions/app';
import YoutubeWelcome from './view';

export default connect(
  null,
  {
    doOpenModal,
  }
)(YoutubeWelcome);
