import { connect } from 'react-redux';
import { doOpenModal } from 'redux/actions/app';
import TipButton from './view';

const select = (state, props) => ({});

export default connect(
  select,
  {
    doOpenModal,
  }
)(TipButton);
