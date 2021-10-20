import { connect } from 'react-redux';
import { selectDateForUri } from 'redux/selectors/claims';
import * as SETTINGS from 'constants/settings';
import { makeSelectClientSetting } from 'redux/selectors/settings';
import DateTime from './view';

const select = (state, props) => ({
  date: props.date || selectDateForUri(state, props.uri),
  clock24h: makeSelectClientSetting(SETTINGS.CLOCK_24H)(state),
});
export default connect(select)(DateTime);
