import { connect } from 'react-redux';
import { doClearCache } from 'redux/actions/app';
import SettingSystem from './view';

const select = (state) => ({});

const perform = (dispatch) => ({
  clearCache: () => dispatch(doClearCache()),
});

export default connect(select, perform)(SettingSystem);
