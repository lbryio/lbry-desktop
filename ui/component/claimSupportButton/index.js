import { connect } from 'react-redux';
import { doOpenModal } from 'redux/actions/app';
import ClaimSupportButton from './view';

export default connect(
  null,
  {
    doOpenModal,
  }
)(ClaimSupportButton);
