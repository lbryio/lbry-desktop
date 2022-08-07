import { connect } from 'react-redux';
import { selectActiveChannelClaim } from 'redux/selectors/app';
import HeaderProfileMenuButton from './view';

const select = (state) => ({
  activeChannelClaim: selectActiveChannelClaim(state),
});

export default connect(select)(HeaderProfileMenuButton);
