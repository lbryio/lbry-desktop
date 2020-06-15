import { connect } from 'react-redux';
import { selectUser } from 'redux/selectors/user';
import OpenInAppLink from './view';

const select = state => ({
  user: selectUser(state),
});

export default connect(select)(OpenInAppLink);
