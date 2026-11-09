//@ts-nocheck
import {connect} from 'react-redux';
import { makeSelectClientSetting } from 'redux/selectors/settings';
import * as SETTINGS from 'constants/settings';
import Page from './view';

const select = (state: unknown, props: unknown) => ({
  videoTheaterMode: makeSelectClientSetting(SETTINGS.VIDEO_THEATER_MODE)(state),
});

export default connect(select)(Page);
