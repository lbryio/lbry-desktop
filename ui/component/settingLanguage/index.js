import { connect } from 'react-redux';
import { doSetLanguage } from 'redux/actions/settings';
import { selectLanguage } from 'redux/selectors/settings';
import SettingLanguage from './view';

const select = (state) => ({
  language: selectLanguage(state),
});

const perform = (dispatch) => ({
  setLanguage: (value) => dispatch(doSetLanguage(value)),
});

export default connect(select, perform)(SettingLanguage);
