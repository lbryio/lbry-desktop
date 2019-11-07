import { connect } from 'react-redux';
import AccountPage from './view';

const select = state => ({});

export default connect(
  select,
  null
)(AccountPage);
