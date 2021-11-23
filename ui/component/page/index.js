import { connect } from 'react-redux';
import { selectClientSetting } from 'redux/selectors/settings';
import * as SETTINGS from 'constants/settings';
import Page from './view';

const select = (state, props) => ({
  videoTheaterMode: selectClientSetting(state, SETTINGS.VIDEO_THEATER_MODE),
});

export default connect(select)(Page);
