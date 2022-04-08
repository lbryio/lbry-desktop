import { connect } from 'react-redux';
import TagsFollowingPage from './view';
import * as SETTINGS from 'constants/settings';
import { selectClientSetting } from 'redux/selectors/settings';

const select = (state) => ({
  tileLayout: selectClientSetting(state, SETTINGS.TILE_LAYOUT),
});

export default connect(select)(TagsFollowingPage);
