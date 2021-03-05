import { connect } from 'react-redux';
import { selectBlockedChannels } from 'redux/selectors/blocked';
import ListBlocked from './view';

const select = state => ({
  uris: selectBlockedChannels(state),
});

export default connect(select, null)(ListBlocked);
