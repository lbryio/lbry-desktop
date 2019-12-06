import { connect } from 'react-redux';
import { selectUser } from 'lbryinc';
import OpenInAppLink from './view';

const select = state => ({
  user: selectUser(state),
});

export default connect(select)(OpenInAppLink);
