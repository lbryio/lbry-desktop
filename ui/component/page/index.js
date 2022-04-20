import { connect } from 'react-redux';
import { makeSelectFileRenderModeForUri } from 'redux/selectors/content';
import { selectClientSetting } from 'redux/selectors/settings';
import * as SETTINGS from 'constants/settings';
import Page from './view';

const select = (state, props) => ({
  renderMode: makeSelectFileRenderModeForUri(state.content.primaryUri)(state),
  videoTheaterMode: selectClientSetting(state, SETTINGS.VIDEO_THEATER_MODE),
});

export default connect(select)(Page);
