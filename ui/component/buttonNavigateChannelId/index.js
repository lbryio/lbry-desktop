import { connect } from 'react-redux';
import { selectActiveChannelId } from 'redux/selectors/app';
import { selectDefaultChannelId } from 'redux/selectors/settings';

import ButtonNavigateChannelId from './view';

const select = (state) => ({
  defaultChannelId: selectDefaultChannelId(state),
  activeChannelId: selectActiveChannelId(state),
});

export default connect(select)(ButtonNavigateChannelId);
