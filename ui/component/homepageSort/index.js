import { connect } from 'react-redux';
import HomepageSort from './view';
import * as SETTINGS from 'constants/settings';
import { selectClientSetting, selectHomepageData } from 'redux/selectors/settings';

const select = (state) => ({
  homepageData: selectHomepageData(state),
  homepageOrder: selectClientSetting(state, SETTINGS.HOMEPAGE_ORDER),
});

// const perform = (dispatch) => ({});

export default connect(select)(HomepageSort);
