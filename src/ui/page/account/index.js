import { connect } from 'react-redux';
import AccountPage from './view';
import { selectYoutubeChannels } from 'lbryinc';

const select = state => ({
  ytChannels: selectYoutubeChannels(state),
});

export default connect(
  select,
  null
)(AccountPage);
