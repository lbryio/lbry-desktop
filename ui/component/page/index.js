import { connect } from 'react-redux';
import { makeSelectClientSetting } from 'redux/selectors/settings';
import { SETTINGS } from 'lbry-redux';
import Page from './view';

const select = (state, props) => ({
  videoTheaterMode: makeSelectClientSetting(SETTINGS.VIDEO_THEATER_MODE)(state),
});

export default connect(select)(Page);
